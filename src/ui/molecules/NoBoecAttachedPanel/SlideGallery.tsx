import { Touch, classNames, getClassName } from "@vkontakte/vkui";
import {
  TouchEvent,
  TouchEventHandler,
} from "@vkontakte/vkui/dist/components/Touch/Touch";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./gallery.css";

export interface BaseGalleryProps {
  slideIndex: number;

  onChange(current: number): void;
}
export interface GalleryProps extends BaseGalleryProps {
  children: React.ReactElement;
}
export interface GalleryState {
  layerWidth?: number;
  min?: number;
  deltaX: number;
  shiftX: number;
  slides: GallerySlidesState[];
  animation: boolean;
  duration: number;
  dragging?: boolean;
}
export interface GallerySlidesState {
  coordX: number;
  width: number;
}

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

interface Props extends BaseGalleryProps {}
const BaseGallery: React.FC<Props> = ({ onChange, slideIndex, children }) => {
  const [state, setState] = useState<GalleryState>({
    deltaX: 0,
    shiftX: 0,
    slides: [],
    animation: true,
    duration: 1.2,
  });
  const container = useRef<HTMLDivElement>(null);

  const calculateIndent = useCallback((targetIndex: number) => {
    const maxSwipeWidth =
      (layerRef.current?.offsetWidth! - container.current?.offsetWidth!) / 2;
    return -targetIndex * maxSwipeWidth;
  }, []);
  const layerRef = useRef<HTMLDivElement>(null);

  const initializeSlides = useCallback(() => {
    const containerWidth = container.current!.offsetWidth;
    const layerWidth = layerRef.current?.offsetWidth!;

    const min = containerWidth - layerWidth;

    setState((prev) => ({
      ...prev,
      min,
      layerWidth,
    }));
  }, []);

  useEffect(() => {
    if (!state.animation) {
      window!.requestAnimationFrame(() =>
        setState((prev) => ({ ...prev, animation: true }))
      );
    }
  }, [state.animation]);

  // /*
  //  * Получает индекс слайда, к которому будет осуществлен переход
  //  */
  const getTarget = (e: TouchEvent) => {
    const { deltaX } = state;

    const direction = deltaX < 0 ? 1 : -1;

    // Находим ближайшую границу слайда к текущему отступу
    let targetIndex =
      direction === 1
        ? clamp(slideIndex + 1, 0, 2)
        : clamp(slideIndex - 1, 0, 2);

    return targetIndex;
  };

  const onStart = () => {
    setState((prev) => ({ ...prev, animation: false }));
  };

  const onMoveX = (e: TouchEvent) => {
    e.originalEvent.preventDefault();

    if (e.isSlideX) {
      if (state.deltaX !== e.shiftX) {
        setState((prev) => ({
          ...prev,
          deltaX: e.shiftX,
          dragging: e.isSlideX,
        }));
      }
    }
  };

  const onEnd: TouchEventHandler = (e: TouchEvent) => {
    const targetIndex = e.isSlide ? getTarget(e) : slideIndex!;

    setState((prev) => ({ ...prev, deltaX: 0, animation: true }));
    onChange!(targetIndex!);
  };

  const onResize: VoidFunction = useCallback(
    () => initializeSlides(),
    [initializeSlides]
  );

  useEffect(() => {
    initializeSlides();

    window!.addEventListener("resize", onResize);
    return () => {
      window!.removeEventListener("resize", onResize);
    };
  }, [initializeSlides, onResize, layerRef]);

  const indent = calculateIndent(slideIndex!);

  const layerStyle = {
    WebkitTransform: `translateX(${indent}px)`,
    transform: `translateX(${indent}px)`,
    WebkitTransition: `-webkit-transform ${state.duration}s cubic-bezier(.1, 0, .25, 1)`,
    transition: `transform ${state.duration}s cubic-bezier(.1, 0, .25, 1)`,
  };

  return (
    <div
      style={{ height: "450px" }}
      className={classNames(getClassName("Gallery"), {
        "Gallery--dragging": state.dragging,
      })}
      ref={container}
    >
      <Touch
        className="Gallery__viewport"
        onStartX={onStart}
        onMoveX={onMoveX}
        onEnd={onEnd}
        noSlideClick
      >
        <div className="Gallery__layer" style={layerStyle}>
          <div ref={layerRef}>{children}</div>
        </div>
      </Touch>

      {true && (
        <div
          aria-hidden="true"
          className={classNames(
            "Gallery__bullets",
            `Gallery__bullets--${true}`
          )}
        >
          {React.Children.map(
            children as React.ReactElement,
            (_item: React.ReactElement, index: number) => (
              <div
                className={classNames("Gallery__bullet", {
                  "Gallery__bullet--active": index === slideIndex,
                })}
                key={index}
              />
            )
          )}
        </div>
      )}
    </div>
  );
  // }
};

const Gallery: React.FC<GalleryProps> = ({ children, onChange, ...props }) => {
  const slideIndex = props.slideIndex;
  const childCount = 3;

  const handleChange: GalleryProps["onChange"] = React.useCallback(
    (current) => {
      if (current === slideIndex) {
        return;
      }
      onChange(current);
    },
    [onChange, slideIndex]
  );

  const safeSlideIndex =
    childCount > 0 ? clamp(slideIndex!, 0, childCount - 1) : slideIndex;
  // notify parent in controlled mode
  React.useEffect(() => {
    if (onChange && safeSlideIndex !== slideIndex) {
      onChange(safeSlideIndex!);
    }
  }, [onChange, safeSlideIndex, slideIndex]);

  return (
    <BaseGallery {...props} slideIndex={safeSlideIndex} onChange={handleChange}>
      {children}
    </BaseGallery>
  );
};

export default Gallery;
