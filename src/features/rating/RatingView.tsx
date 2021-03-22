import React, { FC } from "react";
import { AbstractView } from "../../ui/molecules/AbstractView";
import { RatingListView } from "./pages/RatingListView";
import { RatingViewPanel } from "./pages/RatingViewPanel";

export const RatingView: FC<{ id: string }> = ({ id }) => {
    return (
        <AbstractView id={id}>
            <RatingListView id="base" />
            <RatingViewPanel id="rating_view" />
        </AbstractView>
    );
};
