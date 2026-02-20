# ⚔️ Arcane Quest 03: Arcane Scroll

## 📜 Social Feed Application

> **Difficulty:** ⭐⭐⭐⭐ (Advanced)
> **Type:** Optional — tests React Query mastery
> **Stack:** React + React Query + Zustand + Auth

---

## Misi

Bikin **social feed** — kayak timeline Twitter/Instagram sederhana. Posts, likes, comments, infinite scroll. Quest ini bener-bener nge-test mastery kalian di React Query — mutations, optimistic updates, infinite queries, cache management.

---

## Features

### 1. Authentication (Required)

- Register / Login
- JWT token management
- Protected routes — harus login buat post/like/comment
- User profile (nama, avatar placeholder)

### 2. Post Feed

- **Infinite scroll** — load 10 posts at a time, load more saat scroll ke bawah
- Setiap post tampilkan:
  - Author name + avatar
  - Post content (text)
  - Timestamp (relative: "5m ago", "2h ago")
  - Like count + like button
  - Comment count
- **Create new post** — text area + submit
- **Delete own post** — only author bisa delete

### 3. Like System

- Toggle like/unlike
- **Optimistic update** — like count berubah INSTANTLY sebelum server respond
- Rollback kalo server error
- Heart icon filled (liked) vs outline (not liked)

### 4. Comments

- Expand/collapse comment section per post
- Load comments on demand (click "View 5 comments")
- Add comment (text input)
- Delete own comment
- Real-time comment count update

### 5. Infinite Scroll Implementation

```javascript
// Pake React Query useInfiniteQuery
import { useInfiniteQuery } from '@tanstack/react-query';

function useFeed() {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam = 1 }) => 
      api.get(`/api/posts?page=${pageParam}&limit=10`).then(r => r.data),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined; // No more pages
    },
    initialPageParam: 1,
  });
}
```

```jsx
// Intersection Observer buat detect scroll bottom
function Feed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed();
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return (
    <div>
      {data?.pages.map((page) =>
        page.data.map((post) => <PostCard key={post.id} post={post} />)
      )}
      <div ref={loadMoreRef}>
        {isFetchingNextPage && <Spinner />}
      </div>
    </div>
  );
}
```

### 6. Optimistic Like (Key Challenge)

```javascript
function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => api.post(`/api/posts/${postId}/like`),
    
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      
      // Snapshot previous value
      const previousFeed = queryClient.getQueryData(['feed']);
      
      // Optimistically update
      queryClient.setQueryData(['feed'], (old) => ({
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: page.data.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isLiked: !post.isLiked,
                  likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
                }
              : post
          ),
        })),
      }));
      
      return { previousFeed };
    },
    
    onError: (err, postId, context) => {
      // Rollback on error
      queryClient.setQueryData(['feed'], context.previousFeed);
      toast.error('Gagal like post');
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
```

---

## API Endpoints (Bikin sendiri atau mock)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/posts?page=1&limit=10` | Get paginated feed |
| POST | `/api/posts` | Create post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/like` | Toggle like |
| GET | `/api/posts/:id/comments` | Get comments |
| POST | `/api/posts/:id/comments` | Add comment |
| DELETE | `/api/comments/:id` | Delete comment |

Kalo ngga mau bikin backend, bisa pake **json-server** atau **MSW** buat mock.

---

## Grading

| Criteria | Points |
|---|---|
| Auth (login, register, protected routes) | 15 |
| Post feed with infinite scroll | 20 |
| Create & delete posts | 10 |
| Like system with optimistic updates | 25 |
| Comments (load, add, delete) | 15 |
| UI/UX (responsive, loading states, empty states) | 10 |
| Code quality (hooks, separation, types) | 5 |
| **TOTAL** | **100** |

---

## Tips

1. Build the feed display first (static data)
2. Add infinite scroll with `useInfiniteQuery`
3. Add like with optimistic updates (hardest part — take your time)
4. Add comments last
5. Polish & handle edge cases

This quest will LEVEL UP your React Query skills. Trust the process! 📜
