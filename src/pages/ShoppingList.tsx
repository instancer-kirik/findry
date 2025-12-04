import { useState } from "react";
import Layout from "@/components/layout/Layout";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  ShoppingCart,
  ExternalLink,
  Package,
  CheckCircle2,
} from "lucide-react";
import {
  useGetShoppingList,
  useCreateShoppingListItem,
  useUpdateShoppingListItem,
  useDeleteShoppingListItem,
} from "@/hooks/use-shopping-list";
import {
  ShoppingListItem,
  ShoppingListCategory,
  ShoppingListStatus,
} from "@/types/shopping-list";
import { useGetProjects } from "@/hooks/use-projects";

const categories: ShoppingListCategory[] = [
  "Real Estate",
  "Clothing",
  "Tools",
  "Materials",
  "Rocks",
  "More",
];

const statuses: ShoppingListStatus[] = [
  "planned",
  "budgeted",
  "ordered",
  "purchased",
  "received",
];

const priorities = ["low", "medium", "high"] as const;

export default function ShoppingList() {
  const { data: items = [], isLoading } = useGetShoppingList();
  const { data: projects = [] } = useGetProjects();
  const createItem = useCreateShoppingListItem();
  const updateItem = useUpdateShoppingListItem();
  const deleteItem = useDeleteShoppingListItem();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingListItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [formData, setFormData] = useState<Partial<ShoppingListItem>>({
    item_name: "",
    description: "",
    category: undefined,
    priority: "medium",
    status: "planned",
    estimated_cost: undefined,
    actual_cost: undefined,
    quantity: 1,
    url: "",
    notes: "",
    project_id: undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await updateItem.mutateAsync({ ...formData, id: editingItem.id });
      setEditingItem(null);
    } else {
      await createItem.mutateAsync(
        formData as Omit<ShoppingListItem, "id" | "created_at" | "updated_at">,
      );
    }
    resetForm();
    setIsCreateOpen(false);
  };

  const resetForm = () => {
    setFormData({
      item_name: "",
      description: "",
      category: undefined,
      priority: "medium",
      status: "planned",
      estimated_cost: undefined,
      actual_cost: undefined,
      quantity: 1,
      url: "",
      notes: "",
      project_id: undefined,
    });
  };

  const handleEdit = (item: ShoppingListItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsCreateOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteItem.mutateAsync(id);
    }
  };

  const handleTogglePurchased = async (item: ShoppingListItem) => {
    const newPurchased = !item.purchased;
    const newStatus = newPurchased ? "purchased" : "planned";

    await updateItem.mutateAsync({
      id: item.id,
      purchased: newPurchased,
      status: newStatus,
      purchased_at: newPurchased ? new Date().toISOString() : undefined,
    });
  };

  const filteredItems = items.filter((item) => {
    if (filterCategory !== "all" && item.category !== filterCategory)
      return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    return true;
  });

  const getStatusColor = (status?: ShoppingListStatus) => {
    switch (status) {
      case "planned":
        return "bg-muted text-muted-foreground";
      case "budgeted":
        return "bg-primary/20 text-primary";
      case "ordered":
        return "bg-accent text-accent-foreground";
      case "purchased":
        return "bg-secondary text-secondary-foreground";
      case "received":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Shopping List</h1>
            <p className="text-muted-foreground">
              Track items you want to buy and link them to projects
            </p>
          </div>
          <Dialog
            open={isCreateOpen}
            onOpenChange={(open) => {
              setIsCreateOpen(open);
              if (!open) {
                setEditingItem(null);
                resetForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Edit Item" : "Add New Item"}
                </DialogTitle>
                <DialogDescription>
                  {editingItem
                    ? "Update the details of your shopping list item"
                    : "Add a new item to your shopping list"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="item_name">Item Name *</Label>
                    <Input
                      id="item_name"
                      value={formData.item_name}
                      onChange={(e) =>
                        setFormData({ ...formData, item_name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          category: value as ShoppingListCategory,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          status: value as ShoppingListStatus,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          priority: value as "low" | "medium" | "high",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority.charAt(0).toUpperCase() +
                              priority.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity || 1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantity: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="estimated_cost">Estimated Cost ($)</Label>
                    <Input
                      id="estimated_cost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.estimated_cost || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estimated_cost: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="actual_cost">Actual Cost ($)</Label>
                    <Input
                      id="actual_cost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.actual_cost || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          actual_cost: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="project_id">
                      Link to Project (optional)
                    </Label>
                    <Select
                      value={formData.project_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, project_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="url">URL (link to product)</Label>
                    <Input
                      id="url"
                      type="url"
                      value={formData.url || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, url: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createItem.isPending || updateItem.isPending}
                  >
                    {editingItem ? "Update Item" : "Add Item"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="w-48">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-48">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
            <p className="text-muted-foreground">
              Loading your shopping list...
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {items.length === 0
                  ? "No items yet. Start adding items to your shopping list!"
                  : "No items match the selected filters."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className={`relative overflow-hidden transition-all duration-200 cursor-pointer ${
                  item.purchased
                    ? "bg-green-50 border-green-200 hover:shadow-lg"
                    : "hover:shadow-lg hover:bg-gray-50"
                }`}
                onClick={() => handleTogglePurchased(item)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {item.item_name}
                      </CardTitle>
                      {item.description && (
                        <CardDescription className="mt-1">
                          {item.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {item.purchased && (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      Purchased
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {item.category && (
                      <Badge variant="outline">{item.category}</Badge>
                    )}
                    {item.status && (
                      <Badge className={getStatusColor(item.status)}>
                        {item.status === "received" && (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        )}
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}
                      </Badge>
                    )}
                    {item.priority && (
                      <Badge variant={getPriorityColor(item.priority)}>
                        {item.priority.toUpperCase()}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1 text-sm">
                    {item.quantity && item.quantity > 1 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="font-medium">{item.quantity}</span>
                      </div>
                    )}
                    {item.estimated_cost && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Estimated:
                        </span>
                        <span className="font-medium">
                          ${item.estimated_cost.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {item.actual_cost && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Actual:</span>
                        <span className="font-medium">
                          ${item.actual_cost.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {item.project_id && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Project:</span>
                        <span className="font-medium text-xs">
                          {projects.find((p) => p.id === item.project_id)
                            ?.name || "Linked"}
                        </span>
                      </div>
                    )}
                  </div>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline z-10 relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Product
                    </a>
                  )}

                  {item.notes && (
                    <p className="text-xs text-muted-foreground border-t pt-2 mt-2">
                      {item.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
