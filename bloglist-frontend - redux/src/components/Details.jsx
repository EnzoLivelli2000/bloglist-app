import { useState, forwardRef, useImperativeHandle } from "react"
import PropTypes from 'prop-types'

const Details = (props) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>Hide</button>
            </div>
        </div>
    )
}

Details.propTypes = {
    children: PropTypes.any.isRequired
}

export default Details