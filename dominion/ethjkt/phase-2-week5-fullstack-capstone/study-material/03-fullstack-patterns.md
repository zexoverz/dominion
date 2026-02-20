# 🏗️ 03 — Fullstack Patterns untuk Production

```
╔══════════════════════════════════════════════════════╗
║  "Code yang works di localhost sama code yang works  ║
║   di production itu beda universe. Ini jembatannya." ║
╚══════════════════════════════════════════════════════╝
```

## 🎯 Tujuan Pembelajaran

Setelah materi ini, kalian bakal bisa:

- Organize API routes dengan pattern controller → service → repository
- Validasi input pakai Zod yang bisa di-share antara frontend dan backend
- Handle file upload (Multer + Cloudinary)
- Implement pagination (cursor vs offset)
- Pasang rate limiting biar API gak di-abuse
- Setup caching strategy (in-memory dan Redis intro)
- Versioning API biar gak breaking change

> **Note:** Prisma dan Drizzle udah kalian pelajari di Phase 1 Week 4-5. Kalau perlu review, buka lagi materi `prisma-next-level-orm.md` dan `drizzle-orm.md` dari Phase 1. Di sini kita fokus ke patterns yang BELUM pernah dibahas.

---

## 🏛️ Part 1: API Route Organization — Layered Architecture

### Masalahnya

Gua sering liat codebase pemula yang route handler-nya kayak gini:

```typescript
// ❌ JANGAN GINI — semua logic numpuk di route handler
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;
    
    // Validasi di sini
    if (!name || name.length < 3) {
      return res.status(400).json({ error: 'Name minimal 3 karakter' });
    }
    if (!price || price < 0) {
      return res.status(400).json({ error: 'Price harus positif' });
    }
    
    // Business logic di sini
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      return res.status(409).json({ error: 'Product with this name already exists' });
    }
    
    // Database di sini juga
    const product = await prisma.product.create({
      data: { name, slug, price, categoryId },
      include: { category: true },
    });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

Ini works, tapi begitu project kalian gede — good luck maintain ini. Bayangin 50 route handler kayak gini. Nightmare.

### Solusi: 3-Layer Architecture

```
Request → Controller → Service → Repository → Database
                                                  ↓
Response ← Controller ← Service ← Repository ← Result
```

| Layer | Tugas | Contoh |
|-------|-------|--------|
| **Controller** | Handle HTTP request/response, parse params, return status codes | `productController.ts` |
| **Service** | Business logic, validasi rules, orchestrate multiple repos | `productService.ts` |
| **Repository** | Database queries, CRUD operations | `productRepository.ts` |

### Implementasi

```typescript
// src/repositories/product.repository.ts
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export const productRepository = {
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }) {
    const { skip = 0, take = 20, where, orderBy } = params;
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);
    
    return { products, total };
  },

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true, reviews: true },
    });
  },

  async findBySlug(slug: string) {
    return prisma.product.findUnique({ where: { slug } });
  },

  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
      include: { category: true },
    });
  },

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
  },

  async delete(id: string) {
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  },
};
```

```typescript
// src/services/product.service.ts
import { productRepository } from '../repositories/product.repository';
import { CreateProductInput, UpdateProductInput } from '../types/product';
import { AppError } from '../lib/errors';

export const productService = {
  async list(params: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { page = 1, limit = 20, search, categoryId, sortBy = 'createdAt', sortOrder = 'desc' } = params;

    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(categoryId && { categoryId }),
    };

    const { products, total } = await productRepository.findAll({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: string) {
    const product = await productRepository.findById(id);
    if (!product || !product.isActive) {
      throw new AppError('Product not found', 404);
    }
    return product;
  },

  async create(input: CreateProductInput) {
    // Business logic: generate slug
    const slug = input.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Business logic: check duplicate
    const existing = await productRepository.findBySlug(slug);
    if (existing) {
      throw new AppError('Product with this name already exists', 409);
    }

    return productRepository.create({
      ...input,
      slug,
      category: { connect: { id: input.categoryId } },
    });
  },

  async update(id: string, input: UpdateProductInput) {
    // Verify exists
    await this.getById(id);
    return productRepository.update(id, input);
  },

  async delete(id: string) {
    await this.getById(id);
    return productRepository.delete(id);
  },
};
```

```typescript
// src/controllers/product.controller.ts
import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';
import { createProductSchema, updateProductSchema } from '../validators/product.validator';

export const productController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, categoryId, sortBy, sortOrder } = req.query;
      
      const result = await productService.list({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
        categoryId: categoryId as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getById(req.params.id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createProductSchema.parse(req.body);
      const product = await productService.create(data);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateProductSchema.parse(req.body);
      const product = await productService.update(req.params.id, data);
      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
```

```typescript
// src/routes/product.routes.ts
import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authMiddleware } from '../middleware/auth';
import { roleMiddleware } from '../middleware/role';

const router = Router();

router.get('/', productController.list);
router.get('/:id', productController.getById);
router.post('/', authMiddleware, roleMiddleware('SELLER', 'ADMIN'), productController.create);
router.put('/:id', authMiddleware, roleMiddleware('SELLER', 'ADMIN'), productController.update);
router.delete('/:id', authMiddleware, roleMiddleware('SELLER', 'ADMIN'), productController.delete);

export { router as productRoutes };
```

Sekarang setiap layer punya **satu tanggung jawab**. Controller cuma handle HTTP, service handle business logic, repository handle database. Kalau mau ganti database? Cuma perlu ubah repository. Mau ubah validasi? Cuma perlu ubah service. Clean.

### Custom Error Class

```typescript
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// src/middleware/error.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors';
import { ZodError } from 'zod';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
}
```

---

## ✅ Part 2: Input Validation dengan Zod — Shared FE + BE

### Kenapa Zod?

Zod itu TypeScript-first validation library. Yang bikin dia powerful: schema yang kalian define bisa di-**share** antara frontend dan backend. Satu source of truth.

### Setup

```bash
npm install zod
```

### Shared Schemas

```typescript
// shared/validators/product.ts (atau src/validators/product.validator.ts)
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama product minimal 3 karakter')
    .max(100, 'Nama product maksimal 100 karakter')
    .trim(),
  description: z
    .string()
    .max(2000, 'Deskripsi maksimal 2000 karakter')
    .optional(),
  price: z
    .number()
    .positive('Harga harus lebih dari 0')
    .max(999999999, 'Harga terlalu besar'),
  stock: z
    .number()
    .int('Stock harus bilangan bulat')
    .min(0, 'Stock gak bisa negatif')
    .default(0),
  categoryId: z.string().cuid('Category ID invalid'),
  images: z
    .array(z.string().url('URL gambar invalid'))
    .max(5, 'Maksimal 5 gambar')
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  categoryId: z.string().cuid().optional(),
  sortBy: z.enum(['price', 'createdAt', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Infer TypeScript types dari schema — INI YANG POWERFUL
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
```

### Pakai di Backend (Express middleware)

```typescript
// src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req[source] = schema.parse(req[source]);
      next();
    } catch (error) {
      next(error); // Di-handle oleh errorHandler
    }
  };
}

// Pake di route:
router.post(
  '/',
  authMiddleware,
  validate(createProductSchema, 'body'),
  productController.create
);

router.get(
  '/',
  validate(productQuerySchema, 'query'),
  productController.list
);
```

### Pakai di Frontend (React Hook Form)

```typescript
// Di React component
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema, type CreateProductInput } from '@/validators/product';

function CreateProductForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
  });

  const onSubmit = (data: CreateProductInput) => {
    // data udah validated + typed!
    createProductMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Nama Product</label>
        <input {...register('name')} />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      </div>

      <div>
        <label>Harga</label>
        <input type="number" {...register('price', { valueAsNumber: true })} />
        {errors.price && <span className="text-red-500">{errors.price.message}</span>}
      </div>

      <div>
        <label>Stock</label>
        <input type="number" {...register('stock', { valueAsNumber: true })} />
        {errors.stock && <span className="text-red-500">{errors.stock.message}</span>}
      </div>

      <button type="submit">Create Product</button>
    </form>
  );
}
```

Satu schema, dipake di FE dan BE. Gak perlu nulis validasi dua kali. Kalau rules berubah, ubah di satu tempat aja.

---

## 📁 Part 3: File Upload — Multer + Cloudinary

### Kenapa Cloudinary?

Nyimpen file di server sendiri itu bad idea buat production. Kalau server restart, file ilang. Kalau scale ke multiple servers, file gak sync. Solusinya: upload ke cloud storage. Cloudinary gratis tier-nya generous (25GB storage, 25GB bandwidth/bulan).

### Setup

```bash
npm install multer cloudinary
npm install --save-dev @types/multer
```

### Multer Config (Memory Storage)

```typescript
// src/lib/upload.ts
import multer from 'multer';

// Simpan di memory (buffer), bukan di disk
// Karena kita mau forward ke Cloudinary
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 5, // max 5 files sekaligus
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed. Use: ${allowedMimes.join(', ')}`));
    }
  },
});
```

### Cloudinary Config

```typescript
// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadToCloudinary(
  buffer: Buffer,
  options?: {
    folder?: string;
    width?: number;
    height?: number;
    format?: string;
  }
): Promise<{ url: string; publicId: string }> {
  const { folder = 'uploads', width, height, format = 'webp' } = options || {};

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        format,
        transformation: [
          ...(width || height
            ? [{ width, height, crop: 'limit' as const }]
            : []),
          { quality: 'auto' },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}
```

### Upload Route

```typescript
// src/routes/upload.routes.ts
import { Router } from 'express';
import { upload } from '../lib/upload';
import { uploadToCloudinary } from '../lib/cloudinary';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Single file upload
router.post('/single', authMiddleware, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'products',
      width: 800,
    });

    res.json({
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    next(error);
  }
});

// Multiple files upload
router.post('/multiple', authMiddleware, upload.array('files', 5), async (req, res, next) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files?.length) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const results = await Promise.all(
      files.map(file =>
        uploadToCloudinary(file.buffer, { folder: 'products', width: 800 })
      )
    );

    res.json(results);
  } catch (error) {
    next(error);
  }
});

export { router as uploadRoutes };
```

### Frontend Upload Component

```typescript
// React component buat upload
import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';

function ImageUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await axios.post('/api/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: (data) => {
      onUpload(data.url);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview lokal
    setPreview(URL.createObjectURL(file));
    // Upload ke server
    uploadMutation.mutate(file);
  };

  return (
    <div
      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />

      {preview ? (
        <img src={preview} alt="Preview" className="mx-auto max-h-48 rounded" />
      ) : (
        <p className="text-gray-500">Klik atau drag file ke sini</p>
      )}

      {uploadMutation.isPending && <p className="text-blue-500 mt-2">Uploading...</p>}
      {uploadMutation.isError && <p className="text-red-500 mt-2">Upload gagal, coba lagi</p>}
    </div>
  );
}
```

---

## 📄 Part 4: Pagination — Cursor vs Offset

### Offset-Based Pagination

Yang paling umum. Kalian pasti udah familiar: `?page=2&limit=20` = skip 20 items pertama, ambil 20 berikutnya.

```typescript
// Backend
async function getProducts(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count(),
  ]);

  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}
```

```typescript
// Frontend — React Query + pagination
function ProductList() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['products', { page, limit }],
    queryFn: () => api.get(`/products?page=${page}&limit=${limit}`),
  });

  return (
    <div>
      {/* Product grid */}
      {data?.data.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}

      {/* Pagination controls */}
      <div className="flex gap-2 justify-center mt-6">
        <button
          disabled={!data?.pagination.hasPrev}
          onClick={() => setPage(p => p - 1)}
        >
          Previous
        </button>
        <span>Page {page} of {data?.pagination.totalPages}</span>
        <button
          disabled={!data?.pagination.hasNext}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

**Kelebihan:** Simple, bisa jump ke page manapun.
**Kekurangan:** Kalau ada data baru masuk di tengah, items bisa kelewat atau muncul duplikat. Juga makin lambat di page yang besar (database harus skip banyak rows).

### Cursor-Based Pagination

Cocok buat infinite scroll atau feed yang sering update (social media, chat). Pakai ID atau timestamp item terakhir sebagai "cursor".

```typescript
// Backend
async function getProductsCursor(cursor?: string, limit: number = 20) {
  const products = await prisma.product.findMany({
    take: limit + 1, // ambil 1 lebih buat cek hasMore
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1, // skip cursor item itself
    }),
    orderBy: { createdAt: 'desc' },
  });

  const hasMore = products.length > limit;
  const data = hasMore ? products.slice(0, -1) : products;

  return {
    data,
    nextCursor: hasMore ? data[data.length - 1].id : null,
    hasMore,
  };
}

// Route
router.get('/products', async (req, res) => {
  const { cursor, limit } = req.query;
  const result = await getProductsCursor(
    cursor as string,
    limit ? Number(limit) : undefined
  );
  res.json(result);
});
```

```typescript
// Frontend — React Query infinite scroll
import { useInfiniteQuery } from '@tanstack/react-query';

function InfiniteProductList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products-infinite'],
    queryFn: ({ pageParam }) =>
      api.get(`/products?limit=20${pageParam ? `&cursor=${pageParam}` : ''}`),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return (
    <div>
      {data?.pages.flatMap(page => page.data).map(product => (
        <ProductCard key={product.id} product={product} />
      ))}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full py-3 bg-gray-100 rounded mt-4"
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

**Kelebihan:** Consistent results even with new data, performant di dataset besar.
**Kekurangan:** Gak bisa jump ke page arbitrary (harus sequential).

### Kapan Pakai Yang Mana?

| Skenario | Recommendation |
|----------|---------------|
| Admin table, dashboard | **Offset** — users expect page numbers |
| Social feed, chat, timeline | **Cursor** — data sering berubah |
| E-commerce product list | **Offset** — users mau jump ke page tertentu |
| Notification list | **Cursor** — append-only data |
| Search results | **Offset** — users expect "page 1 of 50" |

---

## 🛡️ Part 5: Rate Limiting

### Kenapa Rate Limiting?

Tanpa rate limiting, siapapun bisa spam API kalian 1000 request per detik. DDoS, brute force login, scraping — semua bisa terjadi. Rate limiting itu kayak bouncer di club: *"Lu udah masuk 100 kali dalam 1 menit, istirahat dulu bro."*

### Setup dengan express-rate-limit

```bash
npm install express-rate-limit
```

```typescript
// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

// General API limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // max 100 requests per 15 menit per IP
  standardHeaders: true, // Return rate limit info di headers
  legacyHeaders: false,
  message: {
    error: 'Terlalu banyak request. Coba lagi dalam 15 menit.',
  },
});

// Strict limiter buat auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // cuma 10 login attempts per 15 menit
  message: {
    error: 'Terlalu banyak percobaan login. Coba lagi nanti.',
  },
});

// Upload limiter
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 30, // 30 uploads per jam
  message: {
    error: 'Upload limit reached. Coba lagi dalam 1 jam.',
  },
});
```

```typescript
// src/index.ts
import express from 'express';
import { apiLimiter, authLimiter, uploadLimiter } from './middleware/rateLimiter';

const app = express();

// Apply general limiter ke semua routes
app.use('/api/', apiLimiter);

// Apply strict limiter ke auth
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Apply upload limiter
app.use('/api/upload', uploadLimiter);
```

### Rate Limit Headers

Setelah setup, setiap response bakal include headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1708200000
```

Frontend bisa baca headers ini buat kasih warning ke user sebelum limit hit.

---

## ⚡ Part 6: Caching Strategies

### Kenapa Caching?

Database query itu mahal. Kalau 1000 users request halaman yang sama, kenapa harus query database 1000 kali? Cache hasilnya, serve dari memory.

### Strategy 1: In-Memory Cache (Simple)

Buat project kecil-menengah, in-memory cache udah cukup. Gak perlu Redis.

```typescript
// src/lib/cache.ts
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, data: T, ttlSeconds: number): void {
    this.store.set(key, {
      data,
      expiry: Date.now() + ttlSeconds * 1000,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  // Hapus semua keys yang match pattern
  invalidate(pattern: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(pattern)) {
        this.store.delete(key);
      }
    }
  }

  // Cleanup expired entries (jalanin secara periodik)
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiry) {
        this.store.delete(key);
      }
    }
  }
}

export const cache = new MemoryCache();

// Cleanup setiap 5 menit
setInterval(() => cache.cleanup(), 5 * 60 * 1000);
```

### Pakai Cache di Service Layer

```typescript
// src/services/product.service.ts
import { cache } from '../lib/cache';

export const productService = {
  async list(params: ProductQuery) {
    const cacheKey = `products:${JSON.stringify(params)}`;
    
    // Cek cache dulu
    const cached = cache.get<ProductListResult>(cacheKey);
    if (cached) return cached;

    // Kalau gak ada di cache, query database
    const result = await productRepository.findAll(params);
    
    // Simpan di cache 5 menit
    cache.set(cacheKey, result, 300);
    
    return result;
  },

  async create(input: CreateProductInput) {
    const product = await productRepository.create(input);
    
    // Invalidate cache setelah create
    cache.invalidate('products:');
    
    return product;
  },

  async update(id: string, input: UpdateProductInput) {
    const product = await productRepository.update(id, input);
    
    // Invalidate related caches
    cache.invalidate('products:');
    cache.delete(`product:${id}`);
    
    return product;
  },
};
```

### Strategy 2: Redis (Production-Grade)

Kalau app kalian scale ke multiple servers, in-memory cache gak sync antar server. Redis solves this — shared cache yang bisa diakses semua server instances.

```bash
npm install ioredis
```

```typescript
// src/lib/redis.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const redisCache = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
    await redis.setex(key, ttlSeconds, JSON.stringify(data));
  },

  async delete(key: string): Promise<void> {
    await redis.del(key);
  },

  async invalidate(pattern: string): Promise<void> {
    const keys = await redis.keys(`${pattern}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },
};
```

> **Buat capstone:** Pakai in-memory cache dulu. Kalau mau poin bonus, tambahin Redis. Railway bisa provision Redis gratis.

---

## 🔢 Part 7: API Versioning

### Kenapa Versioning?

Bayangin kalian deploy API v1 dan mobile app udah pakai. Sekarang mau ganti response format. Kalau langsung ubah, mobile app yang lama langsung CRASH. Solusi: versioning.

### Strategy: URL Path Versioning

Ini yang paling common dan paling gampang di-implement:

```typescript
// src/routes/index.ts
import { Router } from 'express';
import { v1Router } from './v1';
import { v2Router } from './v2';

const router = Router();

router.use('/v1', v1Router);
router.use('/v2', v2Router);

export { router as apiRouter };

// src/routes/v1/index.ts
import { Router } from 'express';
import { productRoutes } from './product.routes';
import { authRoutes } from './auth.routes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
export { router as v1Router };

// src/routes/v2/index.ts
import { Router } from 'express';
import { productRoutes } from './product.routes'; // v2 version
import { authRoutes } from '../v1/auth.routes'; // reuse v1 auth

const router = Router();
router.use('/auth', authRoutes); // sama kayak v1
router.use('/products', productRoutes); // beda response format
export { router as v2Router };
```

```typescript
// src/index.ts
import { apiRouter } from './routes';

app.use('/api', apiRouter);

// Hasilnya:
// GET /api/v1/products → v1 format
// GET /api/v2/products → v2 format (beda response structure)
```

### Kapan Bikin V2?

- Response format berubah **breaking** (field dihapus/renamed)
- Authentication method berubah
- Business logic fundamental berubah

**Jangan bikin v2** kalau cuma nambah field baru (itu backward compatible, gak perlu version baru).

### Tips Versioning

```typescript
// v1 response
{
  "id": 1,
  "name": "Keyboard",
  "price": 1250000,
  "category": "Electronics"  // string
}

// v2 response — category jadi object (BREAKING CHANGE)
{
  "id": "cuid_xxx",           // string ID (BREAKING)
  "name": "Keyboard",
  "price": 1250000,
  "category": {               // object (BREAKING)
    "id": "cuid_yyy",
    "name": "Electronics",
    "slug": "electronics"
  },
  "images": [],               // new field (non-breaking, tapi tetap v2)
  "averageRating": 4.5        // new field
}
```

---

## 📁 Full Project Structure

Kalau kalian implement semua patterns di atas, folder structure kalian bakal kayak gini:

```
apps/api/src/
├── controllers/
│   ├── auth.controller.ts
│   ├── product.controller.ts
│   └── upload.controller.ts
├── services/
│   ├── auth.service.ts
│   ├── product.service.ts
│   └── upload.service.ts
├── repositories/
│   ├── user.repository.ts
│   └── product.repository.ts
├── middleware/
│   ├── auth.ts
│   ├── error.ts
│   ├── validate.ts
│   └── rateLimiter.ts
├── validators/
│   ├── auth.validator.ts
│   └── product.validator.ts
├── routes/
│   ├── v1/
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   └── upload.routes.ts
│   └── index.ts
├── lib/
│   ├── prisma.ts
│   ├── cache.ts
│   ├── cloudinary.ts
│   ├── upload.ts
│   └── errors.ts
├── types/
│   └── index.ts
└── index.ts
```

Clean. Organized. Setiap file punya satu tanggung jawab. Gampang di-navigate, gampang di-test, gampang di-maintain.

---

## 📝 Summary

| Pattern | Key Takeaway |
|---------|-------------|
| **Layered Architecture** | Controller → Service → Repository. Separation of concerns. |
| **Zod Validation** | Satu schema, shared FE + BE. Type inference gratis. |
| **File Upload** | Multer (memory) → Cloudinary. Jangan simpen file di server. |
| **Offset Pagination** | Simple, cocok buat admin tables. `?page=2&limit=20` |
| **Cursor Pagination** | Consistent, cocok buat feeds. `?cursor=lastId` |
| **Rate Limiting** | Protect API dari abuse. Beda limit buat beda endpoint. |
| **In-Memory Cache** | Simple, no dependencies. Cukup buat single-server. |
| **Redis Cache** | Shared cache buat multi-server. Production-grade. |
| **API Versioning** | URL path (`/api/v1/`). Bikin v2 hanya kalau breaking change. |

Semua patterns ini bakal kalian pake di capstone. Gak harus semuanya — pick yang relevant buat project kalian. Tapi minimal **layered architecture + Zod validation + pagination** itu WAJIB. Sisanya poin bonus yang bikin project kalian standout.

---

**Next up:** Testing with Vitest — karena code tanpa test itu kayak deployment tanpa prayer. 🧪
