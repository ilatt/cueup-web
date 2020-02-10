import React, { Component } from 'react';
import styled from 'styled-components';

export const Title = styled.h1`
    color: #fff;
    margin-bottom: 0.3em;
    display: inline-block;
    position: relative;
    font-size: ${({ size }) => (size ? size : '72px')};
    line-height: ${({ line }) => (line ? line : '72px')};
    text-align: ${({ left }) => (left ? 'left' : 'center')};
    @media only screen and (max-width: 685px) {
        font-size: 42px;
        line-height: 45px;
        > * {
            display: none;
        }
    }
`;
