/**
 *  矩阵
 */
export class Matrix {
  constructor(row: number, column: number, value?: number[][]) {
    /* eslint-disable */
    const that: any = this;
    that.r = row;
    that.c = column;

    for (let i = 0; i < row; i++) {
      that[i] = [];
    }

    if (value) {
      for (let i = 0; i < that.r; i++) {
        for (let j = 0; j < that.c; j++) {
          that[i][j] = value[i][j] ?? that[i][j];
        }
      }
    }
  }

  /**
   *  乘-点乘
   *  other 矩阵
   *  结果
   */
  multiplyD(other: any) {
    /* eslint-disable */
    const that: any = this;
    let result: any = new Matrix(that.r, other.c) as any;
    let n = that.c;
    for (let i = 0; i < result.r; i++) {
      for (let j = 0; j < result.c; j++) {
        let value = 0;
        for (let k = 0; k < n; k++) {
          value += that[i][k] * other[k][j];
        }
        result[i][j] = value;
      }
    }

    return result;
  }
}
