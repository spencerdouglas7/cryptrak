import { Injectable } from '@angular/core';
export class TokenData {
    constructor(private _symbol: string, private _name: string, 
                private _rank: number, private _time: string, private _data: any) {
    }

    get symbol() {
        return this._symbol;
    }

    get name() {
        return this._name;
    }
    get rank() {
        return this._rank;
    }

    get time() {
        return this._time;
    }

    get data() {
        return this._data;
    }
    
}