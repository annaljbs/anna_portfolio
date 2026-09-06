import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { site } from '@/content/site';
import { projects, nextLiveProject } from '@/content/projects';
import ProjectPage from '@/components/ProjectPage';

/** Every slug in content/projects.ts renders — live and in-progress alike. */
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: `${project ? project.title : 'Project'} — ${site.name}` };
}

export default async function Page({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  // Keyed by slug so moving between projects remounts and replays the intro.
  return (
    <ProjectPage
      key={project.slug}
      project={project}
      index={projects.indexOf(project) + 1}
      next={nextLiveProject(project)}
    />
  );
}
