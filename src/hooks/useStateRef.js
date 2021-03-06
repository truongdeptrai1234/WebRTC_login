import React, { useRef, useState, useEffect } from 'react'


export function useStateRef(initialValue) {
    const [value, setValue] = useState(initialValue);

    const ref = useRef(value);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return [value, setValue, ref];
}