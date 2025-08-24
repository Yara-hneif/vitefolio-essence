import { useId, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Github } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPreview?: (opts: { username: string; token?: string; includeTopics: boolean }) => void;
  onImportSelected?: () => void;
  onClear?: () => void;
};

const ImportFromGitHub = ({
  open,
  onOpenChange,
  onPreview,
  onImportSelected,
  onClear,
}: Props) => {
  const descId = useId();

  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [includeTopics, setIncludeTopics] = useState(true);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);

  const handlePreview = async () => {
    setIsPreviewing(true);
    try {
      onPreview?.({ username: username.trim(), token: token.trim() || undefined, includeTopics });
      // setHasSelection(...) once you have preview data and user selection
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      onImportSelected?.();
    } finally {
      setIsImporting(false);
    }
  };

  const handleClear = () => {
    setUsername("");
    setToken("");
    setIncludeTopics(true);
    setHasSelection(false);
    onClear?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={descId}
        className="
          w-[calc(100vw-2rem)]
          sm:w-full sm:max-w-lg
          max-h-[85vh] overflow-y-auto
          p-4 sm:p-6
          rounded-xl sm:rounded-2xl
          border shadow-2xl
          bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80
        "
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl font-semibold tracking-tight">
            <Github className="h-5 w-5" />
            Import from GitHub
          </DialogTitle>
          <DialogDescription id={descId} className="text-muted-foreground">
            Fetch your public repositories and add selected ones as draft projects for review.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gh-username">GitHub Username</Label>
            <Input
              id="gh-username"
              placeholder="e.g. octocat"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gh-token">Personal Access Token</Label>
            <Input
              id="gh-token"
              placeholder="ghp_*** (optional)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
              autoComplete="off"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-2 pt-1">
            <Checkbox
              id="include-topics"
              checked={includeTopics}
              onCheckedChange={(v) => setIncludeTopics(Boolean(v))}
            />
            <Label htmlFor="include-topics" className="text-sm">
              Include repository topics
            </Label>
          </div>
        </div>

        {/* Actions: stack on mobile, inline on larger screens */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center gap-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:mr-auto w-full sm:w-auto">
            <Button
              type="button"
              variant="secondary"
              onClick={handlePreview}
              disabled={!username.trim() || isPreviewing}
              className="w-full sm:w-auto"
            >
              {isPreviewing ? "Loading…" : "Preview Repositories"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="w-full sm:w-auto"
            >
              Clear
            </Button>
          </div>

          <Button
            type="button"
            onClick={handleImport}
            disabled={!hasSelection || isImporting}
            className="w-full sm:w-auto"
          >
            {isImporting ? "Importing…" : "Import Selected"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportFromGitHub;
