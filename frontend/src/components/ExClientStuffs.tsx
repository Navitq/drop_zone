'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import style from '@/styles/upgrades.module.scss'
import ItemSm from '@/components/ItemSm'

import { AxiosError } from "axios";

import api from "@/lib/api";
import { useAppDispatch } from '@/lib/hooks';
import { removeFinishedItem } from '@/redux/upgradeReducer'
import ShouldAuthStaff from '@/components/ShouldAuthStaff'

interface upgradeFinished {
    newItem: gunItemModel,
    itemToDelete: string,
}

interface ExClientStuffsInt {
    targetUrl: string,
    body: {
        client_id?: string,
        limit: number,
        startPrice?: number
    }
    activateBtn: (value: gunItemModel) => void,
    addPrize?: upgradeFinished,
    client_id?: string,
    server_id?: string,
    btnText: string,
    subTitleText?: string,
    titleText: string,
    linkTo?: string,

}


interface gunItemModel {
    id: string,
    imgPath: string,
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred',
    type: "usuall" | "rare" | "elite" | "epic" | "classified",
}

function ExClientStuffs(props: ExClientStuffsInt): React.ReactNode {
    const [items, setItems] = useState<gunItemModel[]>([])
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const loadingRef = useRef<boolean>(loading);
    const hasMoreRef = useRef<boolean>(hasMore);
    const multiplyRef = useRef<boolean>(true)
    const addedItemsListRef = useRef<string[]>([])

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!props.addPrize) return;

        addedItemsListRef.current = addedItemsListRef.current.filter(
            (item) => item !== props?.addPrize?.itemToDelete
        );


        console.log(addedItemsListRef.current)

        setItems((state) => {
            let newState = [...state];

            // сначала удаляем
            if (props?.addPrize?.itemToDelete) {
                newState = newState.filter(item => item.id !== props.addPrize!.itemToDelete);
            }

            // потом добавляем
            if (props?.addPrize?.newItem?.id) {
                newState = [props.addPrize.newItem, ...newState,];
                addedItemsListRef.current.push(props?.addPrize?.newItem?.id)
            }

            return newState;
        });

        // диспатч отдельно, после setItems
        if (props.addPrize?.newItem?.id) {
            setTimeout(() => {
                dispatch(removeFinishedItem());
            }, 0);
        }
    }, [props.addPrize]);

    useEffect(() => {
        if (!multiplyRef.current) {
            multiplyRef.current = true;
            return
        }
        getInventory(page)
    }, [page]);

    useEffect(() => {
        console.log(props.body.startPrice, 4444444555555)
        if (!props.body.startPrice) {
            return
        }
        setHasMore(true);
        hasMoreRef.current = true;
        loadingRef.current = true;
        setItems([]);

        // говорим эффекту [page] пропустить первый вызов

        getInventory(1); // вызываем один раз сразу
    }, [props.body.startPrice]);


    useEffect(() => {
        loadingRef.current = loading;
        hasMoreRef.current = hasMore;
    }, [loading, hasMore]);

    useEffect(() => {

        const observer = new IntersectionObserver(
            (entries) => {

                if (entries[0].isIntersecting && !loadingRef.current && hasMoreRef.current) {
                    console.log("cision")
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0 }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, []);




    async function getInventory(page: number = 1) {
        try {
            console.log(hasMoreRef.current, page,)
            if (!props.targetUrl || !hasMoreRef.current) {
                return
            }
            setLoading(true);
            console.log(props.body.startPrice)
            const response = await api.post(props.targetUrl, {
                page,
                body: props.body
            });
            console.log(111111, response.data.items.length)
            if (response?.status == 204) {
                setHasMore(false)
                return;
            } else if (response.data.items.length < props.body.limit) {
                setHasMore(false)
            }
            setItems((state) => {
                const filteredItems = response.data.items.filter(
                    (item: gunItemModel) => !addedItemsListRef.current.includes(item.id)
                );
                return [...state, ...filteredItems];
            });
        } catch (err) {
            const error = err as AxiosError;
            if (error.response?.status === 401) {
                return;
            } else if (error.response?.status === 404) {
                console.log('some action')
            } else {
                console.error("Неизвестная ошибка", error);
            }
            setHasMore(false)
        } finally {
            setLoading(false);
        }
    }

    const handleActivate = useCallback(
        (item: gunItemModel) => () => {
            props.activateBtn(item)
        },
        [props.activateBtn]
    );

    return (
        (
            items.length > 0 ? (<div className={style.ExClientStuffs}>
                {
                    items.map((value) => {
                        return (
                            <ItemSm activateBtnColor={props.client_id ? props.client_id === value.id : props.server_id ? props.server_id === value.id : false} state={value.state} activateBtn={handleActivate(value)} key={value.id} id={value.id} imgPath={value.imgPath} gunModel={value.gunModel} type={value.type} gunStyle={value.gunStyle} gunPrice={value.gunPrice} ></ItemSm>
                        )
                    })
                }
                <div ref={loaderRef} style={{ height: 1, visibility: 'hidden' }} />
            </div >
            ) : (
                < ShouldAuthStaff btnText={props.btnText} subTitleText={props.subTitleText ? props.subTitleText : ""} titleText={props.titleText} linkTo={props.linkTo ? props.linkTo : ""} ></ShouldAuthStaff >
            )
        )
    )
}

export default ExClientStuffs
