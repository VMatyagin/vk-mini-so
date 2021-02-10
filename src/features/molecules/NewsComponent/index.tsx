import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useMst } from "../../stores";
import { getAuthToken, getWallPosts } from "../../VKBridge";
import { Spinner } from "@vkontakte/vkui";
import { WallPost } from "../WallPost";
import { WallGetResponse } from "../../../../api";

export const NewsComponent = observer(() => {
  const [wallData, setWallData] = useState<Array<any>>();
  const [isLoading, setLoading] = useState(true);
  const { accessToken } = useMst().app;
  useEffect(() => {
    if (!accessToken) {
      getAuthToken(["groups"]);
    } else {
      getWallPostFromApi();
    }
  }, [accessToken]);

  const getWallPostFromApi = async () => {
    setLoading(true);
    const token = "spbsoWallData";
    const locStorage = localStorage.getItem(token);
    if (locStorage !== null) {
      setWallData(JSON.parse(locStorage).items);
      setLoading(false);
      return;
    }
    let data = (await getWallPosts()) as WallGetResponse;
    localStorage.setItem(token, JSON.stringify(data));
    setWallData([...data.items]);
    setLoading(false);
  };

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <article>
      {wallData?.map((item) => {
        return <WallPost key={item.id} {...item} />;
      })}
    </article>
  );
});
