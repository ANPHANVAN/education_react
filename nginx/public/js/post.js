
  // Hàm render bài đăng
  async function renderPosts(posts) {
    const userCurrent = await fetchCurrentUser()
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';

    if (!posts || posts.length === 0) {
      postsContainer.innerHTML = '<p class="text-center text-muted">No posts available. Start sharing your travel stories!</p>';
      return;
    }

    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.classList.add('card', 'shadow-sm', 'mb-4', 'border-0');

      // check currentUser just liked post
      let checkCurrentUserLikedPost = false
      for (let i = 0; i < post.like_user.length; i++) {
        if (post.like_user[i] == userCurrent._id) {
          checkCurrentUserLikedPost = true
          break
        }
      }

      postElement.innerHTML = `
        <!-- Header bài đăng -->
        <div class="card-header bg-white border-0 d-flex align-items-center">
          <img src="${post.user.avatar}" alt="Avatar" class="rounded-circle me-3" style="width: 50px; height: 50px; object-fit: cover;">
          <div>
            <h6 class="mb-0 fw-bold" onclick="window.location.href='/me/${post.user._id}'" style="cursor: pointer;">${post.user.fullname}</h6>
            <small class="text-muted">${new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</small>
          </div>
        </div>

        <!-- Nội dung bài đăng -->
        <div class="card-body">
          <p class="card-text">${post.content}</p>
          ${post.images && post.images.length > 0 ? `
            <div class="d-flex flex-wrap gap-2">
              ${post.images.map(image => `
                <img src="${image}" alt="Post Image" class="img-fluid rounded" style="max-width: 250px; max-height: 250px; object-fit: cover;">
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Footer bài đăng (Like, Comment) -->
        <div class="card-footer bg-white border-0">
          <div class="d-flex align-items-center mb-2">

          ${checkCurrentUserLikedPost ? 
            `<button class="btn btn-outline-primary btn-sm like-btn me-2 liked" data-id="${post._id}">
              <i class="bi bi-heart-fill me-1"></i> Like (<span class="like-count">${post.likes}</span>)
            </button>`
            :
            `<button class="btn btn-outline-primary btn-sm like-btn me-2" data-id="${post._id}">
              <i class="bi bi-heart-fill me-1"></i> Like (<span class="like-count">${post.likes}</span>)
            </button>`
          }
            <button class="btn btn-outline-secondary btn-sm comment-btn" data-id="${post._id}">
              <i class="bi bi-chat-left-text-fill me-1"></i> Comment (${post.comments ? post.comments.length : 0})
            </button>
          </div>

          <!-- Danh sách bình luận -->
          <div class="comments-section mt-3" style="display: none;">
            <div class="comment-list mb-3">
              ${post.comments && post.comments.length > 0 ? post.comments.map(comment => 
              `
                <div class="d-flex align-items-start mb-2">
                  <img src="${comment.user.avatar}" alt="Avatar" class="rounded-circle me-2" style="width: 30px; height: 30px; object-fit: cover;">
                  <div class="bg-light p-2 rounded">
                    <strong  onclick="window.location.href='/me/${comment.user._id}'" style="cursor: pointer;">${comment.user.fullname}</strong>
                    <p class="mb-0">${comment.content}</p>
                    <small class="text-muted">${new Date(comment.createdAt).toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric' })}</small>
                  </div>
                </div>
              `).join('') : '<p class="text-muted small">No comments yet.</p>'}
            </div>

            <!-- Form nhập bình luận -->
            <form class="comment-form d-flex align-items-center" data-id="${post._id}">
              <input name="content" type="text" class="form-control form-control-sm me-2 shadow-on-focus" placeholder="Write a comment..." required>
              <button type="submit" class="btn btn-primary btn-sm">Comments</button>
            </form>
          </div>
        </div>
      `;  

      postsContainer.appendChild(postElement);
    });

    // Thêm sự kiện cho các nút Like
    document.querySelectorAll('.like-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const postId = e.target.closest('.like-btn').dataset.id;
        const likeCountSpan = e.target.querySelector('.like-count');
        let likeCount = parseInt(likeCountSpan.textContent);

        try {
          console.log('Liking post:', postId);
          const response = await fetch(`/api/posts/${postId}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.ok) {
            const data = await response.json();
            console.log('Like response data:', data);
            if (data.message === 'Unliked') {
              likeCount--;
              likeCountSpan.textContent = likeCount;
              e.target.classList.remove('liked');
            } else {
              likeCount++;
              likeCountSpan.textContent = likeCount;
              e.target.classList.add('liked');
            }
          } else {
            alert('Failed to like this post.');
          }
        } catch (error) {
          console.error('Error liking post:', error);
          alert('An error occurred.');
        }
      });
    });

    // Thêm sự kiện cho các nút Comment
    document.querySelectorAll('.comment-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const postId = e.target.dataset.id;
        const commentsSection = e.target.closest('.card-footer').querySelector('.comments-section');
        commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
      });
    });

    // Thêm sự kiện cho form bình luận
    document.querySelectorAll('.comment-form').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const postId = e.target.dataset.id;
        const contentInput = e.target.querySelector('input');
        const content = contentInput.value.trim();

        if (!content) return;

        try {
          const response = await fetch(`/api/posts/${postId}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
          });
          if (response.ok) {
            const comment = await response.json();
            const commentList = e.target.previousElementSibling;
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('d-flex', 'align-items-start', 'mb-2');
            commentDiv.innerHTML = `
              <img src="${comment.user.avatar}" alt="Avatar" class="rounded-circle me-2" style="width: 30px; height: 30px; object-fit: cover;">
              <div class="bg-light p-2 rounded">
                <strong>${comment.user.fullname}</strong>
                <p class="mb-0">${comment.content}</p>
                <small class="text-muted">${new Date().toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric' })}</small>
              </div>
            `;
            commentList.appendChild(commentDiv);
            contentInput.value = '';
            const commentBtn = e.target.closest('.card-footer').querySelector('.comment-btn');
            const commentCount = parseInt(commentBtn.textContent.match(/\d+/)[0]) + 1;
            commentBtn.innerHTML = `<i class="bi bi-chat-left-text-fill me-1"></i> Comment (${commentCount})`;
          } else {
            alert('Failed to post comment.');
          }
        } catch (error) {
          console.error('Error posting comment:', error);
          alert('An error occurred.');
        }
      });
    });
  }

  // Gọi API để lấy dữ liệu
  async function fetchPosts(userId) {
    try {
        let response = null
        if (userId==null) {
            response = await fetch('/api/post/all-post');
        } else {
            response = await fetch(`/api/post/user-post/${userId}`);
        }

        const posts = await response.json();
        
        renderPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        renderPosts([]);
    }
  }