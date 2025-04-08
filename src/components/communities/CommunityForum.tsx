
// Create a proper CommunityForum component
import React from 'react';

interface CommunityForumProps {
  communityId: string;
}

const CommunityForum: React.FC<CommunityForumProps> = ({ communityId }) => {
  return (
    <div>
      <h3>Community Forum for {communityId}</h3>
      <p>Forum content will be displayed here.</p>
    </div>
  );
}

export default CommunityForum;
