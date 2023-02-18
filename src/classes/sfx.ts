/* eslint-disable no-sparse-arrays */

import { zzfx } from 'zzfx';

export class Shoot {
  play() {
    zzfx(
      ...[
        1.53,
        ,
        302,
        0.02,
        0.03,
        0.04,
        3,
        1.3,
        -6.5,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        0.11,
        0.81,
        0.08,
        0.09,
      ]
    );
  }
}

export class Hit {
  play() {
    zzfx(
      ...[
        ,
        ,
        1565,
        0.01,
        0.08,
        0.13,
        ,
        1.14,
        -6.7,
        ,
        -196,
        0.04,
        ,
        ,
        7.3,
        ,
        ,
        0.44,
        0.02,
        0.14,
      ]
    );
  }
}

export class Explosion1 {
  play() {
    zzfx(
      ...[
        1.15,
        ,
        915,
        0.01,
        0.24,
        0.51,
        2,
        3.48,
        ,
        0.6,
        ,
        ,
        ,
        1.4,
        20,
        0.2,
        ,
        0.34,
        0.08,
      ]
    );
  }
}

export class PlayerExplosion {
  play() {
    zzfx(
      ...[
        ,
        ,
        982,
        0.02,
        0.18,
        0.5,
        3,
        3.18,
        0.6,
        ,
        ,
        ,
        0.13,
        2,
        -8.6,
        0.9,
        ,
        0.3,
        0.04,
      ]
    );
  }
}
