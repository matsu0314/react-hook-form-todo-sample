"use client";

import * as zod from "zod";
import React, { FC } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// バリデーション
const TodoItemSchema = zod.object({
  todoItem: zod.string().min(1, { message: "入力して下さい。" }),
  isTodoFinish: zod.boolean(),
});

type TodoItem = zod.infer<typeof TodoItemSchema> & { id?: number };

export const EditTodoItemRow: FC<{
  item: TodoItem;
  onCompleted: (isUpdated: boolean) => void;
  apiURL: string;
}> = ({ item, onCompleted, apiURL }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(TodoItemSchema),
    defaultValues: item,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data: TodoItem) => {
    if (item.id) {
      // 更新リクエスト
      await axios.put(`${apiURL}${item.id}`, data);
    } else {
      // 登録リクエスト
      await axios.post(apiURL, data);
    }
    // 更新していたら一覧を更新してから編集状態を解除
    onCompleted(true);
  };

  return (
    <tr onSubmit={handleSubmit(onSubmit)}>
      <td style={{width: "80px"}}>{item.id}</td>
       
      <td>
        <input style={{ width: "100%" }} {...register("todoItem")} />
        {errors.todoItem?.message && (
          <p style={{ color: "red" }}>{errors.todoItem?.message}</p>
        )}
      </td>
      <td style={{width: "80px"}}></td>
      <td style={{ width: "220px", verticalAlign: "top" }}>
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
            // handleSubmitを直接実行
            handleSubmit(onSubmit)();
          }}
        >
          登録
        </button>
      </td>
    </tr>
  );
};

