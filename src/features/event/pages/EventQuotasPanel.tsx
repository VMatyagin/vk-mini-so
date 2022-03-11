import { FC, Fragment, useCallback, useContext, useRef, useState } from "react";
import {
  ActionSheet,
  ActionSheetItem,
  Button,
  Div,
  FixedLayout,
  Group,
  Headline,
  Panel,
  PanelHeaderBack,
  Separator,
  PanelProps,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { Area, Brigade, Shtab } from "../../types";

import styled from "styled-components";
import { Icon24Filter } from "@vkontakte/icons";
import { LazyList } from "../../../ui/organisms/LazyList";
import { BrigadesAPI } from "../../utils/requests/brigades-request";

const Table = styled.table`
  width: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  table-layout: fixed;
`;

const Th = styled.th`
  font-weight: 700;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  margin: 0;
  padding: 8px 0;
  vertical-align: middle;
  line-height: 16px;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;

  padding-left: 10px;
  text-align: center;

  &:first-of-type {
    width: 33%;
    text-align: left;
  }

  &:last-of-type {
    text-align: right;
    padding-left: 10px;
  }
`;
const Td = styled.td`
  font-weight: 400;
  -webkit-font-smoothing: subpixel-antialiased;
  -moz-osx-font-smoothing: auto;

  margin: 0;
  padding: 8px 0;
  vertical-align: middle;
  line-height: 16px;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 10px;
  text-align: center;

  &:first-of-type {
    width: 33%;
    text-align: left;
  }

  &:last-of-type {
    text-align: right;
  }
`;
type Assignable<Obj> = {
  [Key in keyof Obj]: Obj[Key] extends Area | Shtab ? Key : never;
}[keyof Obj];

const renderSortedByAreaOrShtab = (
  brigades: Brigade[],
  renderItem: (brigade: Brigade, index: number) => JSX.Element,
  key: Assignable<Brigade>
) => {
  const grouped = brigades.reduce(
    (result, item) => ({
      ...result,
      [item[key]!.id]: [...(result[item[key].id] || []), item],
    }),
    {} as Record<number, Brigade[]>
  );
  return Object.entries(grouped).map((items) => {
    const [itemId, brigades] = items;
    return (
      <Fragment key={itemId}>
        <tr>
          <td
            colSpan={3}
            style={{
              color: "var(--text_secondary)",
              padding: "10px 8px",
            }}
          >
            <Headline weight="medium">{brigades[0][key].title}</Headline>
          </td>
        </tr>

        {brigades.map((brigade, index) => renderItem(brigade, index))}
      </Fragment>
    );
  });
};

export const EventQuotasPanel: FC<PanelProps> = observer((props) => {
  const { openPopout, closePopout } = useContext(routerStore);
  const [free, setFree] = useState(2);
  const popoutRef = useRef<HTMLElement>(null);
  const [sort, setSort] = useState<string>("shtab");
  const [quotas, setQuotas] = useState<number[]>(Array(200).fill(15));

  const onFilter = () => {
    openPopout(
      <ActionSheet
        onClose={closePopout}
        iosCloseItem={
          <ActionSheetItem autoclose mode="cancel">
            Отменить
          </ActionSheetItem>
        }
        toggleRef={popoutRef.current!}
      >
        <ActionSheetItem
          disabled={sort === "shtab"}
          onClick={() => setSort("shtab")}
          autoclose
        >
          Группировать по штабам
        </ActionSheetItem>
        <ActionSheetItem
          disabled={sort === "area"}
          onClick={() => setSort("area")}
          autoclose
        >
          Группировать по направлениям
        </ActionSheetItem>
      </ActionSheet>
    );
  };

  const renderFn = useCallback(
    (brigade: Brigade) => {
      return (
        <tr key={brigade.id}>
          <Td>{brigade.title}</Td>
          <Td>{quotas[brigade.id]}</Td>
          <Td>
            <Button
              disabled={free === 0}
              size="s"
              mode="primary"
              onClick={() => {
                setQuotas((prev) =>
                  prev.map((quota, quotaIndex) => {
                    if (brigade.id === quotaIndex) {
                      return ++quota;
                    }
                    return quota;
                  })
                );
                setFree((prev) => --prev);
              }}
            >
              +
            </Button>
            <Button
              style={{
                marginLeft: 8,
              }}
              size="s"
              mode="primary"
              onClick={() => {
                setQuotas((prev) =>
                  prev.map((quota, quotaIndex) => {
                    if (brigade.id === quotaIndex) {
                      return --quota;
                    }
                    return quota;
                  })
                );
                setFree((prev) => ++prev);
              }}
            >
              -
            </Button>
          </Td>
        </tr>
      );
    },
    [free, quotas]
  );
  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Квоты
        </Title>
      </PanelHeader>
      <FixedLayout filled vertical="top">
        <Separator wide />
        <Div style={{ display: "flex" }}>
          <Button
            before={<Icon24Filter />}
            size="s"
            stretched
            style={{ marginRight: 8 }}
            mode="outline"
            getRootRef={popoutRef}
            onClick={onFilter}
          >
            Фильтр
          </Button>
          <Button disabled size="s" stretched mode="tertiary">
            Сохранить
          </Button>
        </Div>
        <Separator wide />
      </FixedLayout>
      <Group style={{ padding: "50px 12px" }}>
        <Table>
          <tbody>
            <tr>
              <Th style={{ width: "auto" }}>Отряд</Th>
              <Th style={{ width: 50 }}>Квота</Th>
              <Th style={{ width: 96 }}>Действия</Th>
            </tr>
            <LazyList
              fetchFn={BrigadesAPI.getBrigadesList}
              queryKey={`brigade-list-${sort}`}
              extraFnProp={{
                sort,
              }}
              pullToRefresh
              // customSpinner={
              //   <td colSpan={3}>
              //     <Spinner size="small" style={{ margin: "20px 0" }} />
              //   </td>
              // }
              customRender={(brigades) => {
                if (sort === "area") {
                  return renderSortedByAreaOrShtab(brigades, renderFn, "area");
                }
                return renderSortedByAreaOrShtab(brigades, renderFn, "shtab");
              }}
            />
          </tbody>
        </Table>
      </Group>
      <FixedLayout filled vertical="bottom">
        <Separator wide />
        <Div
          style={{
            color: "var(--text_secondary)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            justifyItems: "center",
          }}
        >
          <Headline weight="medium">Свободно квот</Headline>
          <Headline style={{ color: "var(--text_secondary)" }} weight="medium">
            {free}
          </Headline>
        </Div>
      </FixedLayout>
    </Panel>
  );
});
