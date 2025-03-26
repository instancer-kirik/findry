
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import CollaborationPipeline, { 
  CollaborationProjectProps 
} from '../components/collaboration/CollaborationPipeline';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Sample data for the collaboration pipeline
const sampleProjects: CollaborationProjectProps[] = [
  {
    id: '1',
    title: 'Summer Art Festival 2023',
    description: 'A collaborative art festival featuring multiple artists across various disciplines.',
    startDate: 'Jun 15, 2023',
    endDate: 'Aug 20, 2023',
    stage: 'ideation',
    budget: 12000,
    collaborators: [
      { id: '1', name: 'Emma Thompson', role: 'Lead Artist', discipline: 'Visual Arts', status: 'confirmed' },
      { id: '2', name: 'David Chen', role: 'Coordinator', discipline: 'Project Management', status: 'confirmed' },
      { id: '3', name: 'Sarah Johnson', role: 'Sound Designer', discipline: 'Audio', status: 'invited' }
    ],
    tasks: [
      { id: '1', title: 'Define theme', description: 'Decide on the main theme for the festival', status: 'completed', priority: 'high' },
      { id: '2', title: 'Initial artist outreach', description: 'Contact potential participating artists', status: 'in-progress', priority: 'high' },
      { id: '3', title: 'Venue scouting', description: 'Find and evaluate potential venues', status: 'not-started', priority: 'medium' }
    ],
    tags: ['festival', 'multi-disciplinary', 'summer']
  },
  {
    id: '2',
    title: 'Digital Art Exhibition',
    description: 'Online exhibition showcasing interactive digital art pieces.',
    startDate: 'May 1, 2023',
    endDate: 'Jul 30, 2023',
    stage: 'planning',
    budget: 5000,
    collaborators: [
      { id: '4', name: 'Alex Wong', role: 'Tech Lead', discipline: 'Digital Media', status: 'confirmed' },
      { id: '5', name: 'Maria Garcia', role: 'Curator', discipline: 'Digital Arts', status: 'confirmed' }
    ],
    tasks: [
      { id: '4', title: 'Platform selection', description: 'Choose the best platform for hosting', status: 'completed', priority: 'high' },
      { id: '5', title: 'Artist selection', description: 'Select participating digital artists', status: 'completed', priority: 'medium' },
      { id: '6', title: 'Technical requirements', description: 'Define technical specs needed for each piece', status: 'in-progress', priority: 'high' }
    ],
    tags: ['digital', 'online', 'interactive']
  },
  {
    id: '3',
    title: 'Community Mural Project',
    description: 'Collaborative mural creation involving local artists and community members.',
    startDate: 'Apr 10, 2023',
    endDate: 'Aug 15, 2023',
    stage: 'production',
    budget: 8000,
    collaborators: [
      { id: '6', name: 'James Wilson', role: 'Lead Artist', discipline: 'Murals', status: 'confirmed' },
      { id: '7', name: 'Olivia Brown', role: 'Community Liaison', discipline: 'Community Engagement', status: 'confirmed' },
      { id: '8', name: 'Raj Patel', role: 'Assistant Artist', discipline: 'Painting', status: 'confirmed' }
    ],
    tasks: [
      { id: '7', title: 'Design approval', description: 'Get final approval for mural design', status: 'completed', priority: 'high' },
      { id: '8', title: 'Materials purchase', description: 'Purchase all needed paints and supplies', status: 'completed', priority: 'medium' },
      { id: '9', title: 'Wall preparation', description: 'Prepare the wall surface for painting', status: 'in-progress', priority: 'high' },
      { id: '10', title: 'Community painting day', description: 'Organize the community painting event', status: 'not-started', priority: 'medium' }
    ],
    tags: ['mural', 'community', 'public-art']
  },
  {
    id: '4',
    title: 'Music Video Production',
    description: 'Collaborative production of a music video for indie band.',
    startDate: 'Mar 1, 2023',
    endDate: 'May 15, 2023',
    stage: 'review',
    budget: 15000,
    collaborators: [
      { id: '9', name: 'Tyler Scott', role: 'Director', discipline: 'Film', status: 'confirmed' },
      { id: '10', name: 'Nina Lee', role: 'Choreographer', discipline: 'Dance', status: 'confirmed' },
      { id: '11', name: 'Chris Black', role: 'Director of Photography', discipline: 'Cinematography', status: 'confirmed' },
      { id: '12', name: 'The Echoes', role: 'Band', discipline: 'Music', status: 'confirmed' }
    ],
    tasks: [
      { id: '11', title: 'Storyboarding', description: 'Create detailed storyboard for video', status: 'completed', priority: 'high' },
      { id: '12', title: 'Location scouting', description: 'Find and secure filming locations', status: 'completed', priority: 'medium' },
      { id: '13', title: 'Filming', description: 'Complete all filming sessions', status: 'completed', priority: 'high' },
      { id: '14', title: 'Editing', description: 'Edit footage into final video', status: 'in-progress', priority: 'high' },
      { id: '15', title: 'Final review', description: 'Get feedback from band and stakeholders', status: 'not-started', priority: 'medium' }
    ],
    tags: ['music-video', 'film', 'indie']
  },
  {
    id: '5',
    title: 'Poetry & Photography Book',
    description: 'Collaborative book featuring poetry paired with photography.',
    startDate: 'Jan 15, 2023',
    endDate: 'Apr 30, 2023',
    stage: 'complete',
    budget: 6000,
    collaborators: [
      { id: '13', name: 'Elizabeth Foster', role: 'Lead Poet', discipline: 'Poetry', status: 'confirmed' },
      { id: '14', name: 'Michael Tam', role: 'Photographer', discipline: 'Photography', status: 'confirmed' },
      { id: '15', name: 'Grace Kim', role: 'Book Designer', discipline: 'Graphic Design', status: 'confirmed' }
    ],
    tasks: [
      { id: '16', title: 'Content creation', description: 'Create all poetry and photography', status: 'completed', priority: 'high' },
      { id: '17', title: 'Layout design', description: 'Design the book layout', status: 'completed', priority: 'medium' },
      { id: '18', title: 'Publishing arrangements', description: 'Arrange for printing and distribution', status: 'completed', priority: 'high' },
      { id: '19', title: 'Launch planning', description: 'Plan book launch event', status: 'completed', priority: 'medium' }
    ],
    tags: ['poetry', 'photography', 'book', 'publishing']
  }
];

const Collaboration: React.FC = () => {
  const [projects, setProjects] = useState<CollaborationProjectProps[]>(sampleProjects);
  const navigate = useNavigate();

  const handleCreateProject = () => {
    // In a real app, this would open a form to create a new project
    toast.info("Project creation functionality would be implemented here");
  };

  const handleInviteCollaborator = (projectId: string) => {
    // In a real app, this would open a form to invite collaborators
    toast.info(`Inviting collaborators to project ${projectId}`);
  };

  const handleViewProject = (projectId: string) => {
    // In a real app, this would navigate to a project detail page
    navigate(`/projects/${projectId}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Artist Collaboration</h1>
        <p className="text-muted-foreground mb-8">
          Manage your collaborative projects and connect with other artists to bring your ideas to life.
        </p>
        
        <CollaborationPipeline 
          projects={projects}
          onCreateProject={handleCreateProject}
          onInviteCollaborator={handleInviteCollaborator}
          onViewProject={handleViewProject}
        />
      </div>
    </Layout>
  );
};

export default Collaboration;
