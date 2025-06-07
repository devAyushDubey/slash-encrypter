"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { useRef } from "react";
import { CommonStore, makeStore } from "@/common/store";
import { Provider } from "react-redux";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const storeRef = useRef<CommonStore>()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }


  return (
    <Provider store={storeRef.current}>
      <html lang="en">
        <body className={inter.className}>
          <AntdRegistry >
            {children}
          </AntdRegistry>
        </body>
      </html>
    </Provider>
  );
}
