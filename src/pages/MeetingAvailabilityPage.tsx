import { Link, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import MeetingAvailability from '@/components/meetings/MeetingAvailability';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MeetingAvailabilityPage() {
  const { token } = useParams();
  return <Layout><main className="container mx-auto max-w-6xl space-y-5 py-6"><Button asChild variant="ghost" className="px-0"><Link to="/meetings"><ArrowLeft className="mr-2 h-4 w-4" />Meetings</Link></Button><MeetingAvailability token={token} /></main></Layout>;
}