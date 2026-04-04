import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Film, Clapperboard, Users, MapPin, Camera, FileText, Clock, Plus, Trash2,
  ChevronDown, ChevronUp, CalendarDays, Phone, Mail, DollarSign, AlertTriangle,
  CheckCircle2, Circle, PlayCircle, Megaphone, Edit2, GripVertical
} from 'lucide-react';
import { Project } from '@/types/project';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from 'sonner';

// Types
interface Scene {
  id: string;
  number: number;
  name: string;
  description: string;
  location: string;
  timeOfDay: 'day' | 'night' | 'dawn' | 'dusk' | 'interior';
  characters: string[];
  pages: number;
  status: 'not_started' | 'rehearsed' | 'shot' | 'wrapped';
  notes: string;
}

interface Shot {
  id: string;
  sceneId: string;
  number: string;
  type: 'wide' | 'medium' | 'close-up' | 'extreme-close' | 'over-shoulder' | 'pov' | 'aerial' | 'tracking' | 'dolly' | 'handheld' | 'other';
  description: string;
  duration: string;
  equipment: string[];
  status: 'planned' | 'setup' | 'shot' | 'approved';
  takes: number;
  notes: string;
}

interface CrewMember {
  id: string;
  name: string;
  role: string;
  department: 'direction' | 'camera' | 'sound' | 'lighting' | 'art' | 'wardrobe' | 'makeup' | 'production' | 'post' | 'cast' | 'other';
  phone: string;
  email: string;
  rate: string;
  availability: string;
  notes: string;
}

interface LocationEntry {
  id: string;
  name: string;
  address: string;
  type: 'interior' | 'exterior' | 'studio' | 'practical';
  scenes: string[];
  permitRequired: boolean;
  permitStatus: 'not_needed' | 'pending' | 'approved' | 'denied';
  contactName: string;
  contactPhone: string;
  cost: string;
  notes: string;
  photos: string[];
}

interface CallSheetDay {
  id: string;
  date: string;
  callTime: string;
  wrapTime: string;
  scenes: string[];
  location: string;
  crew: string[];
  cast: string[];
  notes: string;
  weather: string;
  meals: string;
}

interface ProductionPhase {
  name: string;
  status: 'not_started' | 'in_progress' | 'completed';
  startDate: string;
  endDate: string;
  tasks: { name: string; done: boolean }[];
}

interface FilmData {
  scenes: Scene[];
  shots: Shot[];
  crew: CrewMember[];
  locations: LocationEntry[];
  callSheets: CallSheetDay[];
  phases: ProductionPhase[];
  logline: string;
  genre: string;
  runtime: string;
  format: string;
}

const defaultPhases: ProductionPhase[] = [
  { name: 'Development', status: 'not_started', startDate: '', endDate: '', tasks: [
    { name: 'Write treatment', done: false },
    { name: 'Complete screenplay', done: false },
    { name: 'Secure rights/IP', done: false },
    { name: 'Attach key talent', done: false },
  ]},
  { name: 'Pre-Production', status: 'not_started', startDate: '', endDate: '', tasks: [
    { name: 'Breakdown screenplay', done: false },
    { name: 'Scout locations', done: false },
    { name: 'Cast roles', done: false },
    { name: 'Hire crew', done: false },
    { name: 'Create shot lists', done: false },
    { name: 'Schedule shoot days', done: false },
    { name: 'Secure permits', done: false },
    { name: 'Arrange equipment', done: false },
  ]},
  { name: 'Production', status: 'not_started', startDate: '', endDate: '', tasks: [
    { name: 'Principal photography', done: false },
    { name: 'Daily rushes review', done: false },
    { name: 'Sound recording', done: false },
    { name: 'Continuity logging', done: false },
  ]},
  { name: 'Post-Production', status: 'not_started', startDate: '', endDate: '', tasks: [
    { name: 'Rough cut edit', done: false },
    { name: 'Fine cut edit', done: false },
    { name: 'Sound design & mix', done: false },
    { name: 'Color grading', done: false },
    { name: 'Visual effects', done: false },
    { name: 'Music/Score', done: false },
    { name: 'Final master', done: false },
  ]},
  { name: 'Distribution', status: 'not_started', startDate: '', endDate: '', tasks: [
    { name: 'Festival submissions', done: false },
    { name: 'Press kit / EPK', done: false },
    { name: 'Screening events', done: false },
    { name: 'Distribution deal', done: false },
  ]},
];

const uid = () => crypto.randomUUID();

const shotTypes = ['wide', 'medium', 'close-up', 'extreme-close', 'over-shoulder', 'pov', 'aerial', 'tracking', 'dolly', 'handheld', 'other'] as const;
const departments = ['direction', 'camera', 'sound', 'lighting', 'art', 'wardrobe', 'makeup', 'production', 'post', 'cast', 'other'] as const;

interface Props {
  project: Project;
}

const FilmProductionPlanner: React.FC<Props> = ({ project }) => {
  const storageKey = `film-planner-${project.id}`;
  const [data, setData] = useLocalStorage<FilmData>(storageKey, {
    scenes: [],
    shots: [],
    crew: [],
    locations: [],
    callSheets: [],
    phases: defaultPhases,
    logline: '',
    genre: '',
    runtime: '',
    format: '4K',
  });

  const [activeTab, setActiveTab] = useState('overview');

  const updateData = (partial: Partial<FilmData>) => {
    setData({ ...data, ...partial });
  };

  // ─── Overview ────────────────────────────────────────────────
  const completedTasks = data.phases.flatMap(p => p.tasks).filter(t => t.done).length;
  const totalTasks = data.phases.flatMap(p => p.tasks).length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const togglePhaseTask = (phaseIdx: number, taskIdx: number) => {
    const phases = [...data.phases];
    phases[phaseIdx].tasks[taskIdx].done = !phases[phaseIdx].tasks[taskIdx].done;
    const allDone = phases[phaseIdx].tasks.every(t => t.done);
    const anyDone = phases[phaseIdx].tasks.some(t => t.done);
    phases[phaseIdx].status = allDone ? 'completed' : anyDone ? 'in_progress' : 'not_started';
    updateData({ phases });
  };

  // ─── Scenes ──────────────────────────────────────────────────
  const addScene = () => {
    const scene: Scene = {
      id: uid(), number: data.scenes.length + 1, name: '', description: '',
      location: '', timeOfDay: 'day', characters: [], pages: 1,
      status: 'not_started', notes: '',
    };
    updateData({ scenes: [...data.scenes, scene] });
  };

  const updateScene = (id: string, partial: Partial<Scene>) => {
    updateData({ scenes: data.scenes.map(s => s.id === id ? { ...s, ...partial } : s) });
  };

  const removeScene = (id: string) => {
    updateData({ scenes: data.scenes.filter(s => s.id !== id) });
  };

  // ─── Shots ───────────────────────────────────────────────────
  const addShot = (sceneId: string) => {
    const sceneShots = data.shots.filter(s => s.sceneId === sceneId);
    const shot: Shot = {
      id: uid(), sceneId, number: `${sceneShots.length + 1}`, type: 'wide',
      description: '', duration: '', equipment: [], status: 'planned', takes: 0, notes: '',
    };
    updateData({ shots: [...data.shots, shot] });
  };

  const updateShot = (id: string, partial: Partial<Shot>) => {
    updateData({ shots: data.shots.map(s => s.id === id ? { ...s, ...partial } : s) });
  };

  const removeShot = (id: string) => {
    updateData({ shots: data.shots.filter(s => s.id !== id) });
  };

  // ─── Crew ────────────────────────────────────────────────────
  const addCrew = () => {
    const member: CrewMember = {
      id: uid(), name: '', role: '', department: 'production',
      phone: '', email: '', rate: '', availability: '', notes: '',
    };
    updateData({ crew: [...data.crew, member] });
  };

  const updateCrew = (id: string, partial: Partial<CrewMember>) => {
    updateData({ crew: data.crew.map(c => c.id === id ? { ...c, ...partial } : c) });
  };

  const removeCrew = (id: string) => {
    updateData({ crew: data.crew.filter(c => c.id !== id) });
  };

  // ─── Locations ───────────────────────────────────────────────
  const addLocation = () => {
    const loc: LocationEntry = {
      id: uid(), name: '', address: '', type: 'practical', scenes: [],
      permitRequired: false, permitStatus: 'not_needed', contactName: '',
      contactPhone: '', cost: '', notes: '', photos: [],
    };
    updateData({ locations: [...data.locations, loc] });
  };

  const updateLocation = (id: string, partial: Partial<LocationEntry>) => {
    updateData({ locations: data.locations.map(l => l.id === id ? { ...l, ...partial } : l) });
  };

  const removeLocation = (id: string) => {
    updateData({ locations: data.locations.filter(l => l.id !== id) });
  };

  // ─── Call Sheets ─────────────────────────────────────────────
  const addCallSheet = () => {
    const sheet: CallSheetDay = {
      id: uid(), date: '', callTime: '06:00', wrapTime: '18:00',
      scenes: [], location: '', crew: [], cast: [], notes: '', weather: '', meals: '',
    };
    updateData({ callSheets: [...data.callSheets, sheet] });
  };

  const updateCallSheet = (id: string, partial: Partial<CallSheetDay>) => {
    updateData({ callSheets: data.callSheets.map(c => c.id === id ? { ...c, ...partial } : c) });
  };

  const removeCallSheet = (id: string) => {
    updateData({ callSheets: data.callSheets.filter(c => c.id !== id) });
  };

  const phaseStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-4 h-4 text-primary" />;
    if (status === 'in_progress') return <PlayCircle className="w-4 h-4 text-accent-foreground" />;
    return <Circle className="w-4 h-4 text-muted-foreground" />;
  };

  const sceneStatusColor = (status: string) => {
    const map: Record<string, string> = {
      not_started: 'bg-muted text-muted-foreground',
      rehearsed: 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
      shot: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
      wrapped: 'bg-green-500/20 text-green-700 dark:text-green-400',
    };
    return map[status] || map.not_started;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Film className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Overall Progress</p>
              <p className="text-lg font-bold">{overallProgress}%</p>
            </div>
            <Progress value={overallProgress} className="w-32 h-2" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Scenes', value: data.scenes.length, icon: Clapperboard },
            { label: 'Shots', value: data.shots.length, icon: Camera },
            { label: 'Crew', value: data.crew.length, icon: Users },
            { label: 'Locations', value: data.locations.length, icon: MapPin },
            { label: 'Shoot Days', value: data.callSheets.length, icon: CalendarDays },
          ].map(stat => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-3 flex items-center gap-2">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-4">
            <TabsTrigger value="overview">Pipeline</TabsTrigger>
            <TabsTrigger value="scenes">Scenes</TabsTrigger>
            <TabsTrigger value="shots">Shot List</TabsTrigger>
            <TabsTrigger value="crew">Crew</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="callsheets">Call Sheets</TabsTrigger>
          </TabsList>

          {/* ─── Pipeline / Overview ─── */}
          <TabsContent value="overview" className="space-y-4">
            {/* Logline & Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Logline</Label>
                  <Textarea
                    value={data.logline}
                    onChange={e => updateData({ logline: e.target.value })}
                    placeholder="A one-sentence summary of your film..."
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Genre</Label>
                    <Input value={data.genre} onChange={e => updateData({ genre: e.target.value })} placeholder="Drama, Horror..." className="mt-1" />
                  </div>
                  <div>
                    <Label>Target Runtime</Label>
                    <Input value={data.runtime} onChange={e => updateData({ runtime: e.target.value })} placeholder="90 min" className="mt-1" />
                  </div>
                  <div>
                    <Label>Format</Label>
                    <Input value={data.format} onChange={e => updateData({ format: e.target.value })} placeholder="4K, 16mm..." className="mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Production Phases */}
            {data.phases.map((phase, pi) => (
              <Card key={phase.name} className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {phaseStatusIcon(phase.status)}
                    {phase.name}
                    <Badge variant="outline" className="ml-auto text-xs">
                      {phase.tasks.filter(t => t.done).length}/{phase.tasks.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {phase.tasks.map((task, ti) => (
                      <button
                        key={ti}
                        onClick={() => togglePhaseTask(pi, ti)}
                        className="flex items-center gap-2 w-full text-left text-sm py-1 px-2 rounded hover:bg-muted/50 transition-colors"
                      >
                        {task.done
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          : <Circle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        }
                        <span className={task.done ? 'line-through text-muted-foreground' : ''}>{task.name}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* ─── Scenes ─── */}
          <TabsContent value="scenes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Screenplay Breakdown</h2>
              <Button onClick={addScene} size="sm"><Plus className="w-4 h-4 mr-1" /> Add Scene</Button>
            </div>
            {data.scenes.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Clapperboard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No scenes yet. Break down your screenplay into scenes to start planning.</p>
                </CardContent>
              </Card>
            )}
            {data.scenes.map((scene, idx) => (
              <Card key={scene.id} className="border-border/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded shrink-0">SC {scene.number}</span>
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={scene.name}
                          onChange={e => updateScene(scene.id, { name: e.target.value })}
                          placeholder="Scene name..."
                          className="flex-1"
                        />
                        <Select value={scene.status} onValueChange={v => updateScene(scene.id, { status: v as Scene['status'] })}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not_started">Not Started</SelectItem>
                            <SelectItem value="rehearsed">Rehearsed</SelectItem>
                            <SelectItem value="shot">Shot</SelectItem>
                            <SelectItem value="wrapped">Wrapped</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="icon" onClick={() => removeScene(scene.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <Textarea
                        value={scene.description}
                        onChange={e => updateScene(scene.id, { description: e.target.value })}
                        placeholder="Scene description / action..."
                        rows={2}
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs">Location</Label>
                          <Input value={scene.location} onChange={e => updateScene(scene.id, { location: e.target.value })} placeholder="INT. APARTMENT" className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Time of Day</Label>
                          <Select value={scene.timeOfDay} onValueChange={v => updateScene(scene.id, { timeOfDay: v as Scene['timeOfDay'] })}>
                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="day">Day</SelectItem>
                              <SelectItem value="night">Night</SelectItem>
                              <SelectItem value="dawn">Dawn</SelectItem>
                              <SelectItem value="dusk">Dusk</SelectItem>
                              <SelectItem value="interior">Interior (any)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Pages</Label>
                          <Input type="number" value={scene.pages} onChange={e => updateScene(scene.id, { pages: Number(e.target.value) })} className="mt-1" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Characters (comma-separated)</Label>
                        <Input
                          value={scene.characters.join(', ')}
                          onChange={e => updateScene(scene.id, { characters: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                          placeholder="ALEX, JORDAN, RILEY"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Notes</Label>
                        <Input value={scene.notes} onChange={e => updateScene(scene.id, { notes: e.target.value })} placeholder="Special requirements..." className="mt-1" />
                      </div>
                      {/* Shots for this scene */}
                      <div className="pt-2 border-t border-border/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-muted-foreground">Shots ({data.shots.filter(s => s.sceneId === scene.id).length})</span>
                          <Button variant="ghost" size="sm" onClick={() => addShot(scene.id)} className="h-6 text-xs">
                            <Plus className="w-3 h-3 mr-1" /> Shot
                          </Button>
                        </div>
                        {data.shots.filter(s => s.sceneId === scene.id).map(shot => (
                          <div key={shot.id} className="flex gap-2 items-center py-1 text-xs">
                            <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{shot.number}</span>
                            <Select value={shot.type} onValueChange={v => updateShot(shot.id, { type: v as Shot['type'] })}>
                              <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {shotTypes.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <Input
                              value={shot.description}
                              onChange={e => updateShot(shot.id, { description: e.target.value })}
                              placeholder="Shot description"
                              className="flex-1 h-7 text-xs"
                            />
                            <Badge variant="outline" className="text-[10px] shrink-0">{shot.status}</Badge>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeShot(shot.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* ─── Shot List (all shots view) ─── */}
          <TabsContent value="shots" className="space-y-4">
            <h2 className="text-lg font-semibold">Complete Shot List</h2>
            {data.scenes.map(scene => {
              const sceneShots = data.shots.filter(s => s.sceneId === scene.id);
              if (sceneShots.length === 0) return null;
              return (
                <Card key={scene.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">SC {scene.number}: {scene.name || 'Untitled'}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border/50 text-muted-foreground">
                            <th className="text-left py-1 pr-2">#</th>
                            <th className="text-left py-1 pr-2">Type</th>
                            <th className="text-left py-1 pr-2">Description</th>
                            <th className="text-left py-1 pr-2">Duration</th>
                            <th className="text-left py-1 pr-2">Takes</th>
                            <th className="text-left py-1">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sceneShots.map(shot => (
                            <tr key={shot.id} className="border-b border-border/30">
                              <td className="py-1.5 pr-2 font-mono">{shot.number}</td>
                              <td className="py-1.5 pr-2 capitalize">{shot.type}</td>
                              <td className="py-1.5 pr-2">{shot.description || '—'}</td>
                              <td className="py-1.5 pr-2">
                                <Input value={shot.duration} onChange={e => updateShot(shot.id, { duration: e.target.value })} className="h-6 w-16 text-xs" placeholder="5s" />
                              </td>
                              <td className="py-1.5 pr-2">
                                <Input type="number" value={shot.takes} onChange={e => updateShot(shot.id, { takes: Number(e.target.value) })} className="h-6 w-12 text-xs" />
                              </td>
                              <td className="py-1.5">
                                <Select value={shot.status} onValueChange={v => updateShot(shot.id, { status: v as Shot['status'] })}>
                                  <SelectTrigger className="h-6 w-20 text-xs"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="planned">Planned</SelectItem>
                                    <SelectItem value="setup">Setup</SelectItem>
                                    <SelectItem value="shot">Shot</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {data.shots.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Add shots from the Scenes tab first.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ─── Crew ─── */}
          <TabsContent value="crew" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Crew & Cast</h2>
              <Button onClick={addCrew} size="sm"><Plus className="w-4 h-4 mr-1" /> Add Member</Button>
            </div>
            {data.crew.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No crew members added yet.</p>
                </CardContent>
              </Card>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {data.crew.map(member => (
                <Card key={member.id} className="border-border/50">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Input value={member.name} onChange={e => updateCrew(member.id, { name: e.target.value })} placeholder="Name" className="flex-1" />
                      <Button variant="ghost" size="icon" onClick={() => removeCrew(member.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Role</Label>
                        <Input value={member.role} onChange={e => updateCrew(member.id, { role: e.target.value })} placeholder="Director, DP..." className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Department</Label>
                        <Select value={member.department} onValueChange={v => updateCrew(member.id, { department: v as CrewMember['department'] })}>
                          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {departments.map(d => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Phone</Label>
                        <Input value={member.phone} onChange={e => updateCrew(member.id, { phone: e.target.value })} placeholder="555-0123" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Email</Label>
                        <Input value={member.email} onChange={e => updateCrew(member.id, { email: e.target.value })} placeholder="name@..." className="mt-1" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Rate</Label>
                        <Input value={member.rate} onChange={e => updateCrew(member.id, { rate: e.target.value })} placeholder="$200/day" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Availability</Label>
                        <Input value={member.availability} onChange={e => updateCrew(member.id, { availability: e.target.value })} placeholder="Weekends only" className="mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ─── Locations ─── */}
          <TabsContent value="locations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Locations</h2>
              <Button onClick={addLocation} size="sm"><Plus className="w-4 h-4 mr-1" /> Add Location</Button>
            </div>
            {data.locations.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No locations scouted yet.</p>
                </CardContent>
              </Card>
            )}
            {data.locations.map(loc => (
              <Card key={loc.id} className="border-border/50">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input value={loc.name} onChange={e => updateLocation(loc.id, { name: e.target.value })} placeholder="Location name" className="flex-1" />
                    <Select value={loc.type} onValueChange={v => updateLocation(loc.id, { type: v as LocationEntry['type'] })}>
                      <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interior">Interior</SelectItem>
                        <SelectItem value="exterior">Exterior</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="practical">Practical</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => removeLocation(loc.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <Input value={loc.address} onChange={e => updateLocation(loc.id, { address: e.target.value })} placeholder="Address" />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Contact</Label>
                      <Input value={loc.contactName} onChange={e => updateLocation(loc.id, { contactName: e.target.value })} placeholder="Name" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Phone</Label>
                      <Input value={loc.contactPhone} onChange={e => updateLocation(loc.id, { contactPhone: e.target.value })} placeholder="555-0123" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Cost</Label>
                      <Input value={loc.cost} onChange={e => updateLocation(loc.id, { cost: e.target.value })} placeholder="$0/day" className="mt-1" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={loc.permitRequired}
                        onChange={e => updateLocation(loc.id, { permitRequired: e.target.checked })}
                        className="w-3.5 h-3.5 rounded border-border"
                      />
                      Permit required
                    </label>
                    {loc.permitRequired && (
                      <Select value={loc.permitStatus} onValueChange={v => updateLocation(loc.id, { permitStatus: v as LocationEntry['permitStatus'] })}>
                        <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="denied">Denied</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <Input value={loc.notes} onChange={e => updateLocation(loc.id, { notes: e.target.value })} placeholder="Notes (parking, power, noise level...)" />
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* ─── Call Sheets ─── */}
          <TabsContent value="callsheets" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Call Sheets</h2>
              <Button onClick={addCallSheet} size="sm"><Plus className="w-4 h-4 mr-1" /> Add Day</Button>
            </div>
            {data.callSheets.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No shoot days scheduled yet.</p>
                </CardContent>
              </Card>
            )}
            {data.callSheets.map((sheet, idx) => (
              <Card key={sheet.id} className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>Day {idx + 1}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeCallSheet(sheet.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Date</Label>
                      <Input type="date" value={sheet.date} onChange={e => updateCallSheet(sheet.id, { date: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Call Time</Label>
                      <Input type="time" value={sheet.callTime} onChange={e => updateCallSheet(sheet.id, { callTime: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Wrap Time</Label>
                      <Input type="time" value={sheet.wrapTime} onChange={e => updateCallSheet(sheet.id, { wrapTime: e.target.value })} className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Location</Label>
                    <Input value={sheet.location} onChange={e => updateCallSheet(sheet.id, { location: e.target.value })} placeholder="Shoot location" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Scenes (comma-separated scene numbers)</Label>
                    <Input
                      value={sheet.scenes.join(', ')}
                      onChange={e => updateCallSheet(sheet.id, { scenes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      placeholder="1, 3, 5"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Weather</Label>
                      <Input value={sheet.weather} onChange={e => updateCallSheet(sheet.id, { weather: e.target.value })} placeholder="Clear, 72°F" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Meals</Label>
                      <Input value={sheet.meals} onChange={e => updateCallSheet(sheet.id, { meals: e.target.value })} placeholder="Lunch at 12pm" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Notes</Label>
                    <Textarea value={sheet.notes} onChange={e => updateCallSheet(sheet.id, { notes: e.target.value })} placeholder="Special instructions, safety notes..." rows={2} className="mt-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default FilmProductionPlanner;
