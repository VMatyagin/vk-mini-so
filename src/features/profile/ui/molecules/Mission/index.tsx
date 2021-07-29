import { Avatar, Progress, SimpleCell, Subhead } from "@vkontakte/vkui";
import { FC, ReactNode } from "react";

interface MissionProps {
    Icon: ReactNode;
    value: number;
    description: string;
    maxValue: number;
    title: string;
    createdAt?: null | string;
}
export const Mission: FC<MissionProps> = ({
    Icon,
    value,
    maxValue,
    description,
    title,
    createdAt,
}) => {
    return (
        <SimpleCell
            disabled={true}
            description={
                !createdAt && (
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            height: 12,
                        }}
                    >
                        <Progress
                            value={(value / maxValue) * 100}
                            style={{ flex: 1 }}
                        />
                        <div
                            style={{
                                color: "var(--text_secondary)",
                                textAlign: "center",
                                width: 40,
                                fontWeight: 600,
                            }}
                        >
                            <div>{maxValue}</div>
                        </div>
                    </div>
                )
            }
            before={
                <Avatar shadow={false} size={72} mode="image">
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            fontSize: 12,
                        }}
                    >
                        {Icon}
                        {/* <div>Уровень {level}</div> */}
                    </div>
                </Avatar>
            }
            after={
                createdAt && (
                    <div
                        style={{
                            color: createdAt
                                ? "var(--text_secondary)"
                                : undefined,
                        }}
                    >
                        {new Date(createdAt).toLocaleString("ru", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </div>
                )
            }
        >
            <div style={{ color: "var(--text_secondary)" }}>
                {title}
                <Subhead
                    style={{
                        color: "var(--text_secondary)",
                    }}
                    weight="regular"
                >
                    {description}
                </Subhead>
            </div>
        </SimpleCell>
    );
};
