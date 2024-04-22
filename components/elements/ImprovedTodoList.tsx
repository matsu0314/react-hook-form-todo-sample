'use client';

import * as zod from "zod";
import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const TodoItemSchema = zod.object({
  name: zod.string().min(1, {message: '入力して下さい。'}),
  num: zod.number(),
});

type TodoItem = zod.infer<typeof TodoItemSchema> & { id?: number };

const EditTodoItemRow: FC<{
  item: TodoItem;
  onCompleted: (isUpdated: boolean) => void;
}> = ({item, onCompleted}) => {
  const {handleSubmit, register, reset, formState: {errors}} = useForm({
    resolver: zodResolver(TodoItemSchema),
    defaultValues: item,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const onSubmit = async (data: TodoItem) => {
    if (item.id) {
      // 更新リクエスト
      await axios.put(`http://localhost:3001/todo/${item.id}`, data);
    } else {
      // 登録リクエスト
      await axios.post(`http://localhost:3001/todo`, data);
    }
    onCompleted(true);
  }

  return (
    <tr onSubmit={handleSubmit(onSubmit)}>
      <td style={{width: 'auto'}}>
        <input
          style={{width: '100%'}}
          {...register("name")}
        />
        {errors.name?.message && (
          <p style={{color: 'red'}}>
            {errors.name?.message}
          </p>
        )}
      </td>
      <td style={{width: 'auto'}}>{item.num}</td>
      <td style={{width: '220px', verticalAlign: 'top'}}>
        <button
          type="button"
          onClick={() => {
            reset();
            onCompleted(false);
          }}
        >
          キャンセル
        </button>
        <button
          onClick={() => {
            // <table>の中に<form>をレンダリングする訳にもいかないので、handleSubmitを直接実行
            handleSubmit(onSubmit)();
          }}
        >登録
        </button>
      </td>
    </tr>
  )
}

export const ImprovedTodoList = () => {
  const [todoItems, setTodoItems] = useState<TodoItem[]>();
  const [editItemId, setEditItemId] = useState<TodoItem["id"] | "newItem">();

  const fetchTodoItems = async () => {
    const {data} = await axios.get("http://localhost:3001/todo");
    setTodoItems(data);
  }

  useEffect(() => {
    // 初期データの取得
    fetchTodoItems();
  }, []);

  return (
    <table style={{width: '100%'}}>
      <tbody>
      {todoItems?.map((item) => editItemId === item.id
        ? (
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
          />
        ) : (
          <tr key={item.id}>
            <td style={{width: 'auto'}}>
              {item.name}
            </td>
            <td style={{width: 'auto'}}>
              {item.num}
            </td>
            <td style={{width: '220px', verticalAlign: 'top'}}>
              <button
                type="submit"
                disabled={editItemId !== undefined}
                onClick={async () => {
                  if (item.num > 0) {
                    alert('在庫がある商品は削除できません。');
                    return;
                  }
                  const deleteDialog = confirm(
                    `「${item.name}」を削除しますか？`
                  );
                  if (deleteDialog) {
                    await axios.delete(`http://localhost:3001/todo/${item.id}`);
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
        ))}
      {editItemId === "newItem" && (
        <EditTodoItemRow
          item={{
            name: "",
            num: 0,
          }}
          onCompleted={async (isUpdated) => {
            if (isUpdated) {
              await fetchTodoItems();
            }
            setEditItemId(undefined);
          }}
        />
      )}
      <tr>
        <td></td>
        <td></td>
        <td>
          <button
            type="button"
            disabled={editItemId !== undefined}
            style={{
              marginTop: '20px',
              marginLeft: 'auto',
              display: 'block',
              width: '100%',
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
}