'use client'
import React, { useEffect, useState, useRef } from 'react'
import style from '@/styles/upgrades.module.scss'
import ItemSm from '@/components/ItemSm'

import { AxiosError } from "axios";

import api from "@/lib/api";
import { useAppDispatch } from '@/lib/hooks';
import { removeFinishedItem } from '@/redux/upgradeReducer'
import { tree } from 'next/dist/build/templates/app-page';


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
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loadingRef = useRef(loading);
    const hasMoreRef = useRef(hasMore);
    const multiplyRef = useRef<boolean>(true)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!props.addPrize) return;

        setItems((state) => {
            let newState = [...state];

            // сначала удаляем
            if (props?.addPrize?.itemToDelete) {
                newState = newState.filter(item => item.id !== props.addPrize!.itemToDelete);
            }

            // потом добавляем
            if (props?.addPrize?.newItem?.id) {
                newState = [...newState, props.addPrize.newItem];
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
                return [...state, ...response.data.items];
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

    return (
        <div className={style.ExClientStuffs}>
            {
                items.map((value) => {
                    return (
                        <ItemSm state={value.state} activateBtn={() => { props.activateBtn(value) }} key={value.id} id={value.id} imgPath={value.imgPath} gunModel={value.gunModel} type={value.type} gunStyle={value.gunStyle} gunPrice={value.gunPrice}></ItemSm>
                    )
                })
            }
            <div ref={loaderRef} style={{ height: 1, visibility: 'hidden' }} />
        </div >
    )
}

export default ExClientStuffs
