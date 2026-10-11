"use client";

import { useState } from "react";
import Image from "next/image";
import { cn, type StyleWithVars } from "@/lib/cn";
import type { CarPhoto } from "@/types/car";

/**
 * Graded catalog photo (§9): monochrome grade with per-shot overrides,
 * mirroring, skeleton sweep until loaded, then a 600ms fade-in, and the
 * fixed overlay stack (softbox → fade + vignette + inner frame).
 * `curtain` enables the clip-path reveal driven by the parent [data-reveal].
 */
export function CarPhotoImage({
  photo,
  sizes,
  defaultPosition,
  curtain = false,
  className,
}: {
  photo: CarPhoto;
  sizes: string;
  defaultPosition: string;
  curtain?: boolean;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  const style: StyleWithVars = { objectPosition: photo.position ?? defaultPosition };
  if (photo.brightness !== undefined) style["--photo-b"] = photo.brightness;
  if (photo.contrast !== undefined) style["--photo-c"] = photo.contrast;

  return (
    <div className={cn("photo-frame", curtain && "photo-curtain", className)}>
      {loaded ? null : <span className="photo-skeleton" aria-hidden="true" />}
      <div className="photo-zoom">
        <div className="photo-zoom-in">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={sizes}
            onLoad={() => setLoaded(true)}
            className={cn("photo-grade object-cover", photo.mirror && "-scale-x-100", loaded && "is-loaded")}
            style={style}
          />
        </div>
      </div>
      <span className="photo-softbox" aria-hidden="true" />
      <span className={cn("photo-overlay", photo.shadeBottom && "photo-overlay-strong")} aria-hidden="true" />
    </div>
  );
}
