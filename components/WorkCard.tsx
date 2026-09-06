import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/content/site';
import type { Project } from '@/content/projects';
import ProjectVideo from './ProjectVideo';
import styles from './Work.module.css';

type Props = {
  project: Project;
  index: number;
};

/**
 * One full-width project row (§3.4): meta column left, media + title +
 * description + link right. `status: 'wip'` renders the in-progress state:
 * grayscale static cover, "In progress" pill, non-clickable link.
 * data-cursor feeds the custom cursor label in step 7 ("View" / "Soon").
 */
export default function WorkCard({ project, index }: Props) {
  const live = project.status === 'live';
  const href = `/work/${project.slug}`;
  const number = `(${String(index).padStart(2, '0')})`;

  const media = (
    <div className={styles.mediaInner} data-media-inner>
      <Image
        src={project.cover}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 72vw"
        className={styles.asset}
        unoptimized={project.cover.endsWith('.svg')}
      />
      {live && project.video && (
        <ProjectVideo video={project.video} poster={project.cover} className={`${styles.asset} ${styles.video}`} />
      )}
    </div>
  );

  return (
    <li className={styles.row} data-row data-status={project.status} data-cursor={live ? 'view' : 'soon'}>
      <div className={`${styles.meta} t-mono`}>
        <span className={styles.index} data-meta>
          {number}
          {!live && <span className={styles.pill}>{site.work.wipPill}</span>}
        </span>
        <span data-meta>{project.category}</span>
        <span data-meta>{project.year}</span>
      </div>

      <div className={styles.main}>
        {live ? (
          <Link href={href} className={styles.media} data-media aria-label={`${project.title} — ${site.work.viewLabel}`}>
            {media}
          </Link>
        ) : (
          <div className={styles.media} data-media>
            {media}
          </div>
        )}

        <h3 className={styles.title}>
          <span className={styles.titleReveal} data-title>
            <span className={styles.titleStack}>
              <span className={styles.titleText}>{project.title}</span>
              <span className={styles.titleText} aria-hidden="true">
                {project.title}
              </span>
            </span>
          </span>
        </h3>

        <p className={`${styles.desc} t-body`} data-text>
          {project.description}
        </p>

        {live ? (
          <Link href={href} className={`${styles.link} t-mono`} data-text>
            {site.work.viewLabel}
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </Link>
        ) : (
          <span className={`${styles.link} ${styles.linkDisabled} t-mono`} aria-disabled="true" data-text>
            {site.work.wipLabel}
          </span>
        )}
      </div>
    </li>
  );
}
