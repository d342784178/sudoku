// pages/api/[functionName].ts
import SuperJSON from "superjson";
import {NextRequest} from 'next/server';
import {loadPuzzle, putPuzzle} from "@/lib/service/PuzzleService";
import {listSudokuPuzzle} from "@/lib/dal/SudokuPuzzleMapper";
import {createUserStep, deleteUserStepById} from "@/lib/dal/UserStepMapper";

type FetchFunctionType<TParams extends any[], TResult> = (...args: TParams) => Promise<TResult>;

class Proxy<TParams extends any[], TResult> {
    private originFunc: FetchFunctionType<TParams, TResult>;
    private proxyFunc: FetchFunctionType<TParams, TResult>;

    constructor(originFunc: FetchFunctionType<TParams, TResult>) {
        this.originFunc = originFunc;
        this.proxyFunc = withProxy(originFunc);
    }

    public invoke(...args: TParams): Promise<TResult> {
        return this.proxyFunc(...args);
    }

    protected invokeOrigin(...args: TParams): Promise<TResult> {
        return this.originFunc(...args);
    }
}


function withProxy<TParams extends any[], TResult>(
    fetchFunction: FetchFunctionType<TParams, TResult>
): (...args: TParams) => Promise<TResult> {
    const functionName = fetchFunction.name;
    const apiUrl = `/api/proxy?functionName=${functionName}`;

    return async (...args: TParams): Promise<TResult> => {
        if (typeof window === "undefined") {
            return fetchFunction(...args);
        } else {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // 注意这里我们序列化的是参数数组
                body: SuperJSON.stringify(args),
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            return new Promise<TResult>((resolve, reject) => {
                response.json().then((json) => {
                    // 反序列化结果并处理多个参数
                    const result = SuperJSON.deserialize(json);
                    resolve(result as TResult);
                });
            });
        }
    };
}

export async function Handler(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const functionName = searchParams.get('functionName');
    // @ts-ignore
    const proxy = ProxyHub[functionName];

    if (proxy) {
        const args = await req.json();
        // 反序列化参数数组
        const argsArray: any[] = SuperJSON.deserialize(args);
        // ...argsArray 将参数数组展开为多个独立参数进行传递
        const functionResult = await proxy.invokeOrigin(...argsArray);
        return Response.json(SuperJSON.serialize(functionResult));
    } else {
        return Response.json(SuperJSON.serialize({msg: '接口不存在:' + functionName}));
    }
}

export const ProxyHub = {
    loadPuzzle: new Proxy(loadPuzzle),
    listSudokuPuzzle: new Proxy(listSudokuPuzzle),
    putPuzzle: new Proxy(putPuzzle),
    createUserStep: new Proxy(createUserStep),
    deleteUserStepById: new Proxy(deleteUserStepById),
    // ...根据需要添加其他函数
};