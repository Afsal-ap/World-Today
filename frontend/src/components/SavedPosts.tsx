import { useGetSavedPostsQuery } from '../store/slices/userApiSlice';



 

const SavedPosts = () => {
  const { data: savedPostsResponse, isLoading, error } = useGetSavedPostsQuery();
  console.log('SavedPosts Response:', savedPostsResponse);

  // Extract the saved posts data from the response
  // const savedPosts = savedPostsResponse?.data || []; 
  if (isLoading) { 
    return <div className="text-center py-4">Loading saved posts...</div>;
  }

  if (error) {
    console.error('Saved posts error:', error);
    return <div className="text-red-500 text-center py-4">Error loading saved posts</div>;
  }

  if (!savedPostsResponse?.length) {
    return <div className="text-gray-500 text-center py-4">No saved posts yet</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {savedPostsResponse.map((post: any) => (
        <div key={post.postId} className="bg-white rounded-lg shadow-md p-4">
          <div className="p-4">
            <h3 className="text-lg font-semibold">{post.postTitle}</h3>  {/* Updated */}
            <p className="text-gray-600 mt-2">Saved on: {new Date(post.savedAt).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};


export default SavedPosts;
