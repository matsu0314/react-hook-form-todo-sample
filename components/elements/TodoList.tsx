'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray, useWatch, Control } from 'react-hook-form';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ダミーデータ（初期値）
export const dummyData = [
  {
    name: 'item1',
    num: 10,
  },

  {
    name: 'item2',
    num: 0,
  },
  {
    name: 'item3',
    num: 3,
  },
];

// バリデーションルール
const schema = zod.object({
  todo: zod.array(
    zod.object({
      name: zod.string().min(1, { message: '入力して下さい。' }),
      num: zod.number(),
    })
  ),
});

// タイプの設定
type FormInputs = zod.infer<typeof schema>;

export const TodoList = () => {
  const {
    handleSubmit,
    register,
    control,
    trigger,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      todo: dummyData,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });
  const { fields, append, remove, update } = useFieldArray({
    name: 'todo',
    control,
  });

  // 送信時のイベント
  const onSubmit = async (data: FormInputs) => {
    console.log(data);
    // テーブルを全体更新したいが、オプションが必要なので存在しない値を設定
    // TODO：そもそもAPIにデータを送信するなら必要ない処理？？
    update(-1, { name: fields[0].name, num: fields[0].num });
    setEditing('');
    // reset();
  };
  // 編集の可否を管理
  const [editing, setEditing] = useState('');
  // 編集前のデータを管理
  const [inputData, setInputData] = useState<FormInputs>({
    todo: dummyData,
  });
  // 新しい項目を追加した時の処理
  useEffect(() => {
    if (editing === 'newEdit') {
      setEditing(fields[fields.length - 1].id);
    }
    setInputData({ todo: fields.map((field) => field) });
  }, [fields, editing]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <table style={{ width: '100%' }}>
        <tbody>
          {fields.map((field: any, index: number) => (
            <tr key={index}>
              <td style={{ width: 'auto' }}>
                {editing !== field.id ? (
                  <>{field.name}</>
                ) : (
                  <>
                    <input
                      style={{ width: '100%' }}
                      {...register(`todo.${index}.name` as const)}
                      defaultValue={field.name}
                    />

                    {errors.todo?.[index]?.name?.message && (
                      <p style={{ color: 'red' }}>
                        {errors.todo?.[index]?.name?.message}
                      </p>
                    )}
                  </>
                )}
              </td>
              <td style={{ width: 'auto' }}>{field.num}</td>

              <td style={{ width: '220px', verticalAlign: 'top' }}>
                {/* 削除した時、APIにデータを送信する予定 */}
                {/* TODO:タイミングによってsubmitが効いていないように見える */}
                {editing !== field.id ? (
                  <button
                    type="submit"
                    disabled={editing !== ''}
                    onClick={() => {
                      if (field.num > 0) {
                        alert('在庫がある商品は削除できません。');
                        return;
                      }
                      const deleteDialog = confirm(
                        `「${field.name}」を削除しますか？`
                      );
                      if (deleteDialog) {
                        remove(index);
                      }
                    }}
                  >
                    削除
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      // 新しく追加した項目をキャンセルした場合は削除する
                      if (field.name === '') {
                        remove(index);
                      } else {
                        // 更新前の値をセット
                        setValue('todo', inputData.todo);
                      }
                      setEditing('');
                    }}
                  >
                    キャンセル
                  </button>
                )}

                {editing !== field.id ? (
                  <button
                    type="button"
                    disabled={editing !== ''}
                    onClick={(e) => {
                      e.preventDefault();
                      setEditing(field.id);
                    }}
                  >
                    変更
                  </button>
                ) : (
                  // 登録した時、APIにデータを送信する予定
                  <button type="submit">登録</button>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td></td>
            <td>
              <button
                type="button"
                disabled={editing !== ''}
                style={{
                  marginTop: '20px',
                  marginLeft: 'auto',
                  display: 'block',
                  width: '100%',
                }}
                onClick={(event) => {
                  event.preventDefault();
                  setEditing('newEdit');
                  append({
                    name: '',
                    num: 0,
                  });
                }}
              >
                追加
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};
