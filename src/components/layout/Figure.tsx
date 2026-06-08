import Image from "next/image";
import styles from "./Figure.module.scss";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  priority?: boolean;
  sizes?: string;
  pixelArt?: boolean;
};

export function Figure({ src, alt, width, height, caption, priority, sizes, pixelArt }: Props) {
  return (
    <figure className={styles.figure}>
      <div className={`${styles.frame} ${pixelArt ? styles.pixel : ""}`.trim()}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes={sizes ?? "(min-width: 768px) 720px, 100vw"}
          className={styles.image}
        />
      </div>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}
