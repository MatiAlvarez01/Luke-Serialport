import React from "react";
import { useDispatch } from "react-redux";
import { closePort, selectPort } from "../../action";
import styled from "styled-components";

let Card = styled.div`
    margin: 1%;
    border: solid 1px;
    padding: 1%
`

function PortCard({portDetails, statePort, setStatePort}) {
    const dispatch = useDispatch();
    if (statePort === portDetails.path) {
        Card = styled.div`
        margin: 1%;
        border: solid 2px green;
        padding: 1%
    `
    } else {
        Card = styled.div`
        margin: 1%;
        border: solid 1px;
        padding: 1%
    `
    }
    function handleCardClick(e) {
        e.preventDefault();
        if(statePort === portDetails.path) {
            dispatch(closePort())
            setStatePort(false);
        } else {
            dispatch(selectPort(portDetails.path));
            setStatePort(portDetails.path);
        }
    }
    return (
        <Card onClick={handleCardClick}>
            <p>Path: {portDetails.path}</p>
            <p>Manufacturer: {portDetails.manufacturer}</p>
            <p>Serial Number: {portDetails.serialNumber}</p>
            <p>pnpId: {portDetails.pnpId}</p>
            <p>Location Id: {portDetails.locationId}</p>
            <p>Vendor Id: {portDetails.vendorId}</p>
            <p>Product Id: {portDetails.productId}</p>
        </Card>
    )
}

export default PortCard;