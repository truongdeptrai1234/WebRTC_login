import React, { PureComponent } from 'react'

import './Button.css'

export const ActiveButton = ({ onClick, text, fontSize }) => {
	return (
		<button
			className="active-button"
			onClick={
				onClick ||
				(() => {
					console.log('Button clicked')
				})
			}
			style={{ fontSize: `${fontSize || 25}px` }}
		>
			{text || 'Button text here'}
		</button>
	)
}
