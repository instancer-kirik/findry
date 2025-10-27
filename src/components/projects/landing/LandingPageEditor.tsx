import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  Save,
  Palette,
  Type,
  Image,
  Video,
  Layout,
  Link,
  Settings,
} from "lucide-react";
import {
  ProjectLandingPage,
  LandingPageSection,
  SocialLink,
} from "@/types/project";
import { cn } from "@/lib/utils";
import CustomLandingPage from "./CustomLandingPage";
import { Project } from "@/types/project";

interface LandingPageEditorProps {
  project: Project;
  landingPage?: ProjectLandingPage;
  onSave: (landingPage: ProjectLandingPage) => void;
  onCancel: () => void;
}

const defaultLandingPage: ProjectLandingPage = {
  hero_title: "",
  hero_subtitle: "",
  call_to_action: "Learn More",
  cta_link: "",
  theme: "default",
  sections: [
    {
      id: "features",
      type: "features",
      title: "Key Features",
      order: 1,
      visible: true,
    },
    {
      id: "timeline",
      type: "timeline",
      title: "Development Timeline",
      order: 2,
      visible: true,
    },
  ],
  social_links: [],
};

const LandingPageEditor: React.FC<LandingPageEditorProps> = ({
  project,
  landingPage,
  onSave,
  onCancel,
}) => {
  const [editingPage, setEditingPage] = useState<ProjectLandingPage>(
    landingPage || { ...defaultLandingPage },
  );
  const [activeTab, setActiveTab] = useState("hero");
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (landingPage) {
      setEditingPage(landingPage);
    }
  }, [landingPage]);

  const handleSave = () => {
    console.log("LandingPageEditor: handleSave called");
    console.log("LandingPageEditor: editingPage data:", editingPage);

    // Basic validation
    if (!editingPage.hero_title || !editingPage.hero_subtitle) {
      alert("Please fill in both Hero Title and Hero Subtitle before saving.");
      return;
    }

    console.log("LandingPageEditor: calling onSave with:", editingPage);
    onSave(editingPage);
  };

  const handleTestSave = () => {
    const testData = {
      hero_title: "Test Project",
      hero_subtitle: "This is a test landing page",
      call_to_action: "Learn More",
      cta_link: `/projects/${project.id}`,
      theme: "default" as const,
      sections: [],
      social_links: [],
    };
    console.log("LandingPageEditor: Test save with:", testData);
    onSave(testData);
  };

  const updateField = (field: keyof ProjectLandingPage, value: unknown) => {
    setEditingPage((prev) => ({ ...prev, [field]: value }));
  };

  const addSection = (type: LandingPageSection["type"]) => {
    const newSection: LandingPageSection = {
      id: `section_${Date.now()}`,
      type,
      title: `New ${type} Section`,
      order: editingPage.sections.length + 1,
      visible: true,
    };

    updateField("sections", [...editingPage.sections, newSection]);
  };

  const updateSection = (
    sectionId: string,
    updates: Partial<LandingPageSection>,
  ) => {
    updateField(
      "sections",
      editingPage.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section,
      ),
    );
  };

  const removeSection = (sectionId: string) => {
    updateField(
      "sections",
      editingPage.sections.filter((section) => section.id !== sectionId),
    );
  };

  const moveSectionUp = (sectionId: string) => {
    const sections = [...editingPage.sections];
    const index = sections.findIndex((s) => s.id === sectionId);
    if (index > 0) {
      [sections[index], sections[index - 1]] = [
        sections[index - 1],
        sections[index],
      ];
      sections[index].order = index + 1;
      sections[index - 1].order = index;
      updateField("sections", sections);
    }
  };

  const moveSectionDown = (sectionId: string) => {
    const sections = [...editingPage.sections];
    const index = sections.findIndex((s) => s.id === sectionId);
    if (index < sections.length - 1) {
      [sections[index], sections[index + 1]] = [
        sections[index + 1],
        sections[index],
      ];
      sections[index].order = index + 1;
      sections[index + 1].order = index + 2;
      updateField("sections", sections);
    }
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      platform: "website",
      url: "",
      label: "New Link",
    };

    updateField("social_links", [...(editingPage.social_links || []), newLink]);
  };

  const updateSocialLink = (index: number, updates: Partial<SocialLink>) => {
    const links = [...(editingPage.social_links || [])];
    links[index] = { ...links[index], ...updates };
    updateField("social_links", links);
  };

  const removeSocialLink = (index: number) => {
    const links = [...(editingPage.social_links || [])];
    links.splice(index, 1);
    updateField("social_links", links);
  };

  if (previewMode) {
    return (
      <div className="h-screen bg-background">
        <div className="fixed top-4 left-4 z-50 flex gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(false)}>
            <Settings className="h-4 w-4 mr-2" />
            Edit Mode
          </Button>
          <Button
            onClick={handleSave}
            disabled={!editingPage.hero_title || !editingPage.hero_subtitle}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Landing Page
          </Button>
        </div>
        <CustomLandingPage
          project={project}
          landingPage={editingPage}
          isOwner={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Landing Page Editor</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreviewMode(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!editingPage.hero_title || !editingPage.hero_subtitle}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Landing Page
              </Button>
              <Button
                onClick={handleTestSave}
                variant="outline"
                className="ml-2"
              >
                Test Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="hero">
              <Type className="h-4 w-4 mr-2" />
              Hero
            </TabsTrigger>
            <TabsTrigger value="sections">
              <Layout className="h-4 w-4 mr-2" />
              Sections
            </TabsTrigger>
            <TabsTrigger value="theme">
              <Palette className="h-4 w-4 mr-2" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="social">
              <Link className="h-4 w-4 mr-2" />
              Social
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Settings className="h-4 w-4 mr-2" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hero_title">Hero Title</Label>
                  <Input
                    id="hero_title"
                    placeholder="Your amazing project title"
                    value={editingPage.hero_title || ""}
                    onChange={(e) => updateField("hero_title", e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Current value: "{editingPage.hero_title || "empty"}"
                  </p>
                </div>

                <div>
                  <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                  <Textarea
                    id="hero_subtitle"
                    placeholder="Describe what makes your project special"
                    value={editingPage.hero_subtitle || ""}
                    onChange={(e) =>
                      updateField("hero_subtitle", e.target.value)
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Current value: "{editingPage.hero_subtitle || "empty"}"
                  </p>
                </div>

                <div>
                  <Label htmlFor="hero_image">Hero Image URL</Label>
                  <Input
                    id="hero_image"
                    placeholder="https://example.com/hero-image.jpg"
                    value={editingPage.hero_image || ""}
                    onChange={(e) => updateField("hero_image", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="hero_video">Hero Video URL</Label>
                  <Input
                    id="hero_video"
                    placeholder="https://example.com/hero-video.mp4"
                    value={editingPage.hero_video || ""}
                    onChange={(e) => updateField("hero_video", e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Video will override background image if provided
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cta_text">Call to Action Text</Label>
                    <Input
                      id="cta_text"
                      placeholder="Get Started"
                      value={editingPage.call_to_action || ""}
                      onChange={(e) =>
                        updateField("call_to_action", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="cta_link">Call to Action Link</Label>
                    <Input
                      id="cta_link"
                      placeholder="https://example.com"
                      value={editingPage.cta_link || ""}
                      onChange={(e) => updateField("cta_link", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sections" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Page Sections</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Section</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() => addSection("text")}
                    >
                      <Type className="h-6 w-6" />
                      Text
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() => addSection("features")}
                    >
                      <Layout className="h-6 w-6" />
                      Features
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() => addSection("gallery")}
                    >
                      <Image className="h-6 w-6" />
                      Gallery
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() => addSection("timeline")}
                    >
                      <Layout className="h-6 w-6" />
                      Timeline
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {editingPage.sections
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                  <Card key={section.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{section.type}</Badge>
                          <span className="font-medium">{section.title}</span>
                          <div className="flex items-center gap-1">
                            <Label
                              htmlFor={`visible-${section.id}`}
                              className="text-sm"
                            >
                              Visible
                            </Label>
                            <Switch
                              id={`visible-${section.id}`}
                              checked={section.visible}
                              onCheckedChange={(checked) =>
                                updateSection(section.id, { visible: checked })
                              }
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSectionUp(section.id)}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSectionDown(section.id)}
                            disabled={index === editingPage.sections.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSection(section.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Section Title</Label>
                        <Input
                          placeholder="Section title"
                          value={section.title || ""}
                          onChange={(e) =>
                            updateSection(section.id, { title: e.target.value })
                          }
                        />
                      </div>
                      {section.type === "text" && (
                        <div>
                          <Label>Content</Label>
                          <Textarea
                            placeholder="Section content (HTML allowed)"
                            rows={4}
                            value={section.content || ""}
                            onChange={(e) =>
                              updateSection(section.id, {
                                content: e.target.value,
                              })
                            }
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="theme" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme & Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Theme Preset</Label>
                  <Select
                    value={editingPage.theme}
                    onValueChange={(value) =>
                      updateField("theme", value as ProjectLandingPage["theme"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="showcase">Showcase</SelectItem>
                      <SelectItem value="hype">Hype</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="sleek">Sleek</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={editingPage.background_color || "#ffffff"}
                        onChange={(e) =>
                          updateField("background_color", e.target.value)
                        }
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        placeholder="#ffffff"
                        value={editingPage.background_color || ""}
                        onChange={(e) =>
                          updateField("background_color", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={editingPage.text_color || "#000000"}
                        onChange={(e) =>
                          updateField("text_color", e.target.value)
                        }
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        placeholder="#000000"
                        value={editingPage.text_color || ""}
                        onChange={(e) =>
                          updateField("text_color", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={editingPage.accent_color || "#3b82f6"}
                        onChange={(e) =>
                          updateField("accent_color", e.target.value)
                        }
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        placeholder="#3b82f6"
                        value={editingPage.accent_color || ""}
                        onChange={(e) =>
                          updateField("accent_color", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Social Links</h2>
              <Button onClick={addSocialLink}>
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>

            <div className="space-y-4">
              {(editingPage.social_links || []).map((link, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4 items-end">
                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <div>
                          <Label>Platform</Label>
                          <Select
                            value={link.platform}
                            onValueChange={(value) =>
                              updateSocialLink(index, {
                                platform: value as SocialLink["platform"],
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="github">GitHub</SelectItem>
                              <SelectItem value="twitter">Twitter</SelectItem>
                              <SelectItem value="youtube">YouTube</SelectItem>
                              <SelectItem value="instagram">
                                Instagram
                              </SelectItem>
                              <SelectItem value="website">Website</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>URL</Label>
                          <Input
                            placeholder="https://..."
                            value={link.url}
                            onChange={(e) =>
                              updateSocialLink(index, { url: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Label (Optional)</Label>
                          <Input
                            placeholder="Custom label"
                            value={link.label || ""}
                            onChange={(e) =>
                              updateSocialLink(index, { label: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSocialLink(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="custom_css">Custom CSS</Label>
                  <Textarea
                    id="custom_css"
                    placeholder="/* Add your custom styles here */"
                    rows={10}
                    value={editingPage.custom_css || ""}
                    onChange={(e) => updateField("custom_css", e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Add custom CSS to further customize your landing page
                    appearance
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LandingPageEditor;
