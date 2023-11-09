'use client';
import React, { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="min-h-screen p-2 flex flex-row items-center justify-center">
      <h1>{error}</h1>
    </div>
  );
}
