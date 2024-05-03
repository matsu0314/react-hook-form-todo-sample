"use client";

import * as zod from "zod";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { EditTodoItemRow } from "./EditTodoItemRow";

const TodoItemSchema = zod.object({
  todoItem: zod.string().min(1, { message: "入力して下さい。" }),
  isTodoFinish: zod.boolean(),
});

// APIURL
const apiURL = "http://localhost:3001/todo/";

type TodoItem = zod.infer<typeof TodoItemSchema> & { id?: number };

export const TodoList = () => {
  // タスク一覧を管理（State）
  const [todoItems, setTodoItems] = useState<TodoItem[]>();
  // 編集するタスクのIDを管理（State）
  const [editItemId, setEditItemId] = useState<TodoItem["id"] | "newItem">();

  // jsonを取得してStateに格納
  const fetchTodoItems = async () => {
    const { data } = await axios.get(apiURL);
    setTodoItems(data);
  };

  useEffect(() => {
    // 初期データの取得
    fetchTodoItems();
  }, []);

  return (
    <table style={{ width: "100%" }}>
      <tbody>
        <tr>
          <th>No.</th>
          <th>タスク</th>
          <th>完了</th>
          <th></th>
        </tr>
        {todoItems?.map((item) =>
          editItemId === item.id ? (
            <EditTodoItemRow
              key={item.id}
              item={item}
              onCompleted={async (isUpdated) => {
                // 更新していたら一覧を更新してから編集状態を解除
                if (isUpdated) {
                  await fetchTodoItems();
                }
                setEditItemId(undefined);
              }}
              apiURL = {apiURL}
            />
          ) : (
            <tr key={item.id}>
              <td style={{width: "80px"}}>{item.id}</td>
              <td>
                {item.isTodoFinish ? (
                  <span style={{ textDecoration: "line-through", color:"red" }}>
                    {item.todoItem}
                  </span>
                ) : (
                  `${item.todoItem}`
                )}
              </td>
              <td style={{width: "80px"}}>
                <input
                  type="checkbox"
                  checked={item.isTodoFinish}
                  // 完了チェックを変更したらデータ更新
                  onChange={async (e) => {
                    item.isTodoFinish = e.target.checked;
                    await axios.put(
                      `${apiURL}${item.id}`,
                      item
                    );
                    await fetchTodoItems();
                  }}
                />
              </td>
              <td style={{ width: "220px", verticalAlign: "top" }}>
                <button
                  type="submit"
                  disabled={editItemId !== undefined}
                  onClick={async () => {
                    if (item.isTodoFinish === false) {
                      alert("完了していないタスクは削除できません。");
                      return;
                    }
                    const deleteDialog = confirm(
                      `「${item.todoItem}」を削除しますか？`
                    );
                    if (deleteDialog) {
                      await axios.delete(
                        `${apiURL}${item.id}`
                      );
                      await fetchTodoItems();
                    }
                  }}
                >
                  削除
                </button>
                <button
                  type="button"
                  disabled={editItemId !== undefined}
                  onClick={(e) => {
                    setEditItemId(item.id);
                  }}
                >
                  変更
                </button>
              </td>
            </tr>
          )
        )}
        {/* 新しいtodoを追加 */}
        {editItemId === "newItem" && (
          <EditTodoItemRow
            item={{
              todoItem: "",
              isTodoFinish: false,
            }}
            onCompleted={async (isUpdated) => {
              if (isUpdated) {
                await fetchTodoItems();
              }
              setEditItemId(undefined);
            }}
            apiURL={apiURL}
          />
        )}
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <button
              type="button"
              disabled={editItemId !== undefined}
              style={{
                marginTop: "20px",
                marginLeft: "auto",
                display: "block",
                width: "100%",
              }}
              onClick={(event) => {
                setEditItemId("newItem");
              }}
            >
              追加
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
