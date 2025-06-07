"use client";
import "./page.scss";
import { randomBytes } from "crypto";
import { useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic'
import MainApp from "@/components/MainApp";
import FooterAnchor from "@/components/FooterAnchor";
import PageActions from "@/components/PageActions";
 
// const ComponentC = dynamic(() => import('../components/MainApp'), { ssr: false })

export default function Home() {

  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(new URL("./calculation.ts", import.meta.url));
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return (
    <div className="home-page">
      <PageActions />
      <MainApp worker={workerRef}/>
      <FooterAnchor />
    </div>
  )
}
