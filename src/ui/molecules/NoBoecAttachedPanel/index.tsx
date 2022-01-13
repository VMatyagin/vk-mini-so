import {
  Button,
  Caption,
  Div,
  Gallery,
  Panel,
  PanelProps,
  Title,
} from "@vkontakte/vkui";
import { FC, useState } from "react";
import imageUrl from "./NDMZ08JmlyA.jpeg";
import provodnik from "./XZGIumsFUAw.jpeg";
import selhoz from "./HVrz3D31fxw.jpeg";

const slides = [
  {
    title: "Мы — СТУДОТРЯДЫ",
    headline: "Лучшее молодежное движение в стране",
  },
  {
    title: "Второй заголовок",
    headline: "Какие мы классные, все дела",
  },
  {
    title: "Третий заголовок",
    headline: "Какая нибудь мотивирующая\n\nхрень",
  },
];
export const NoBoecAttachedPanel: FC<PanelProps> = (props) => {
  const [slideIndex, setSlideIndex] = useState(0);

  return (
    <Panel {...props} style={{ textAlign: "center" }}>
      <Gallery
        slideIndex={slideIndex}
        onChange={setSlideIndex}
        slideWidth="100%"
        align="right"
        bullets="light"
      >
        <div
          style={{
            pointerEvents: "none",
            height: "450px",
            position: "relative",
          }}
        >
          <img
            src={imageUrl}
            height={450}
            style={{
              display: "block",
              objectFit: "cover",
              objectPosition: "left",
              position: "absolute",
              width: "100%",
              left: 0,
              top: 0,
            }}
            alt=""
          />
          <div
            style={{
              background:
                "linear-gradient(180deg, transparent, var(--background_content) 450px, var(--background_content))",
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        <div
          style={{
            pointerEvents: "none",
            height: "450px",
            position: "relative",
          }}
        >
          <img
            src={provodnik}
            height={450}
            style={{
              display: "block",
              objectFit: "cover",
              objectPosition: "left",
              position: "absolute",
              width: "100%",
              left: 0,
              top: 0,
            }}
            alt=""
          />
          <div
            style={{
              background:
                "linear-gradient(180deg, transparent, var(--background_content) 450px, var(--background_content))",
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        <div
          style={{
            pointerEvents: "none",
            height: "450px",
            position: "relative",
          }}
        >
          <img
            src={selhoz}
            height={450}
            style={{
              display: "block",
              objectFit: "cover",
              objectPosition: "left",
              position: "absolute",
              width: "100%",
              left: 0,
              top: 0,
            }}
            alt=""
          />
          <div
            style={{
              background:
                "linear-gradient(180deg, transparent, var(--background_content) 450px, var(--background_content))",
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </Gallery>
      <div
        style={{
          position: "absolute",
          top: 475,
          left: 0,
          width: "100%",
        }}
      >
        <Title level="1" weight="bold">
          {slides[slideIndex].title}
        </Title>
        <Caption
          style={{ marginTop: "12px", opacity: 0.7 }}
          level="1"
          weight="regular"
        >
          {slides[slideIndex].headline}
        </Caption>
      </div>
      {slideIndex === 2 ? (
        <Div
          style={{
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
          }}
        >
          <Button stretched mode="secondary" size="l">
            Я боец
          </Button>
          <Button style={{ marginTop: 16 }} stretched size="l">
            Заполнить анкету
          </Button>
        </Div>
      ) : (
        <Div
          style={{
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
          }}
        >
          <Button mode="tertiary" size="s" onClick={() => setSlideIndex(2)}>
            Пропустить
          </Button>
        </Div>
      )}
    </Panel>
  );
};
