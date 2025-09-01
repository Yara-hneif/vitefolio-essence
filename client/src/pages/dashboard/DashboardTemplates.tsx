import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import TemplateSelector from "@/features/templates/TemplateSelector";
import { createSiteFromTemplate } from "@/lib/templates";

export default function DashboardTemplates() {
  const { user } = useUser();
  const nav = useNavigate();

  async function handleSelect(template: any) {
    if (!user?.id) return;
    const { homePageId } = await createSiteFromTemplate(template, {
      name: template.name,
      slug: `${template.id}-${Date.now()}`,
      description: template.description,
      userId: user.id,
    });
    nav(`/editor/${homePageId}`);
  }

  return (
    <div className="p-6">
      <TemplateSelector
        onSelectTemplate={handleSelect}
        onClose={() => nav("/dashboard")}
      />
    </div>
  );
}
