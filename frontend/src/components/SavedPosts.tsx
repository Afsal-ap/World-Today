import { useState, useEffect } from 'react';
import { useGetSavedPostsQuery } from '../store/slices/userApiSlice';

interface Post {
  _id: string;
  title: string;
  content: string;
  media: string;
  mediaType: string;
  channelName: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

const SavedPosts = () => {
  const { data: savedPosts, isLoading, error } = useGetSavedPostsQuery({});
  
  console.log('SavedPosts component state:', { savedPosts, isLoading, error });

  if (isLoading) {
    return <div className="text-center py-4">Loading saved posts...</div>;
  }

  if (error) {
    console.error('Saved posts error:', error);
    return <div className="text-red-500 text-center py-4">Error loading saved posts</div>;
  }

  if (!savedPosts?.length) {
    return <div className="text-gray-500 text-center py-4">No saved posts yet</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {savedPosts.map((post: Post) => (
        <div key={post._id} className="bg-white rounded-lg shadow-md p-4">
          {post.media && (
            <img 
              src={post.media.startsWith('http') ? post.media : `http://localhost:3001${post.media}`}
              alt={post.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-gray-600 mt-2">{post.content}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                By {post.channelName}
              </span>
              <div className="flex space-x-4">
                <span className="text-sm text-gray-500">
                  ❤️ {post.likesCount}
                </span>
                <span className="text-sm text-gray-500">
                  💬 {post.commentsCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedPosts;
