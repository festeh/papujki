import React from 'react'

const Gif = (props) => {
	if (props.type == "reverse") {
		return <img src={"/reverseparrot.gif"} alt="parrot" className='w-12 relative header-icon' />

	}
	return (
		<img src={"/parrot.gif"} alt="parrot" className='w-12 ml-5 relative header-icon' />
	)
}

export default Gif
