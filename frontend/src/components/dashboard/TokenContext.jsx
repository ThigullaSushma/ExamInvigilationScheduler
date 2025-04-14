import React, { createContext, useContext, useState } from "react";

// Create Context
export const TokenContext = createContext();

// Token Provider Component
export const useToken=()=>useContext(TokenContext)
