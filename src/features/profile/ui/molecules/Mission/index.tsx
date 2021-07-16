import { Avatar, Progress, SimpleCell, Subhead } from "@vkontakte/vkui";
import { FC, ReactNode } from "react";

interface MissionProps {
    Icon: ReactNode;
    value: number;
    level: number;
    maxValue: number;
    title: string;
    goal: string;
    done?: boolean;
}
export const Mission: FC<MissionProps> = ({
    Icon,
    value,
    maxValue,
    level,
    title,
    goal,
    done,
}) => {
    return (
        <SimpleCell
            disabled={true}
            description={
                !done && (
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
                        <div>Уровень {level}</div>
                    </div>
                </Avatar>
            }
            after={
                done && (
                    <div
                        style={{
                            color: done ? "var(--text_secondary)" : undefined,
                        }}
                    >
                        {new Date().toLocaleString("ru", {
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
                    {goal}
                </Subhead>
            </div>
        </SimpleCell>
    );
};
