/**
 * Resample.js
 *
 * Copyright 2014, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

define("moxie/runtime/html5/image/Resample", [
	"moxie/core/utils/Basic"
], function(Basic) {

	// Pixel interpolation algorithms by Daniel G. Taylor (http://programmer-art.org/about/)

	function nearest_unrolled(pixels, x, y, width) {
		var yw4x4 = ((y + 0.5) ^ 0) * width * 4 + ((x + 0.5) ^ 0) * 4;
		return [
			pixels[yw4x4],
			pixels[yw4x4 + 1],
			pixels[yw4x4 + 2]
		];
    }


	function bilinear_unrolled(pixels, x, y, width) {
		var percentX = x - (x ^ 0);
		var percentX1 = 1.0 - percentX;
		var percentY = y - (y ^ 0);
		var percentY1 = 1.0 - percentY;
		var fx4 = (x ^ 0) * 4;
		var cx4 = fx4 + 4;
		var fy4 = (y ^ 0) * 4;
		var cy4wr = (fy4 + 4) * width;
		var fy4wr = fy4 * width;
		var cy4wg = cy4wr + 1;
		var fy4wg = fy4wr + 1;
		var cy4wb = cy4wr + 2;
		var fy4wb = fy4wr + 2;
		var top, bottom, r, g, b;

		top = pixels[cy4wr + fx4] * percentX1 + pixels[cy4wr + cx4] * percentX;
		bottom = pixels[fy4wr + fx4] * percentX1 + pixels[fy4wr + cx4] * percentX;
		r = top * percentY + bottom * percentY1;

		top = pixels[cy4wg + fx4] * percentX1 + pixels[cy4wg + cx4] * percentX;
		bottom = pixels[fy4wg + fx4] * percentX1 + pixels[fy4wg + cx4] * percentX;
		g = top * percentY + bottom * percentY1;

		top = pixels[cy4wb + fx4] * percentX1 + pixels[cy4wb + cx4] * percentX;
		bottom = pixels[fy4wb + fx4] * percentX1 + pixels[fy4wb + cx4] * percentX;
		b = top * percentY + bottom * percentY1;

		return [r, g, b];
	}


	function bicubic_unrolled(pixels, x, y, width) {
		var a, b, c, d, v0, v1, v2, v3, r, g, b;
		var fx = x ^ 0;
		var fy = y ^ 0;
		var percentX = x - fx;
		var percentY = y - fy;

		var fx14 = fx * 4;
		var fx04 = fx14 - 4;
		var fx24 = fx14 + 4;
		var fx34 = fx14 + 8;
		var w4 = width * 4;
		var yw14r = fy * w4;
		var yw04r = yw14r - w4;
		var yw24r = yw14r + w4;
		var yw34r = yw14r + w4 + w4;
		var yw14g = yw14r + 1;
		var yw04g = yw04r + 1;
		var yw24g = yw24r + 1;
		var yw34g = yw34r + 1;
		var yw14b = yw14r + 2;
		var yw04b = yw04r + 2;
		var yw24b = yw24r + 2;
		var yw34b = yw34r + 2;

		// Red
		a = pixels[yw04r + fx04];
		b = pixels[yw04r + fx14];
		c = pixels[yw04r + fx24];
		d = pixels[yw04r + fx34];
		v0 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
		v0 = v0 > 255 ? 255 : v0 < 0 ? 0 : v0;

		a = pixels[yw14r + fx04];
		b = pixels[yw14r + fx14];
		c = pixels[yw14r + fx24];
		d = pixels[yw14r + fx34];
		v1 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
		v1 = v1 > 255 ? 255 : v1 < 0 ? 0 : v1;

		a = pixels[yw24r + fx04];
		b = pixels[yw24r + fx14];
		c = pixels[yw24r + fx24];
		d = pixels[yw24r + fx34];
		v2 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
		v2 = v2 > 255 ? 255 : v2 < 0 ? 0 : v2;

		a = pixels[yw34r + fx04];
		b = pixels[yw34r + fx14];
		c = pixels[yw34r + fx24];
		d = pixels[yw34r + fx34];
		v3 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
		v3 = v3 > 255 ? 255 : v3 < 0 ? 0 : v3;

		a = v0;
		b = v1;
		c = v2;
		d = v3;
		r = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentY) * percentY) * percentY + b;
		r = r > 255 ? 255 : r < 0 ? 0 : r ^ 0;

		// Green
		a = pixels[yw04g + fx04];
		b = pixels[yw04g + fx14];
		c = pixels[yw04g + fx24];
		d = pixels[yw04g + fx34];
		v0 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
		v0 = v0 > 255 ? 255 : v0 < 0 ? 0 : v0;

		a = pixels[yw14g + fx04];
		b = pixels[yw14g + fx14];
		c = pixels[yw14g + fx24];
		d = pixels[yw14g + fx34];
		v1 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
		v1 = v1 > 255 ? 255 : v1 < 0 ? 0 : v1;

		a = pixels[yw24g + fx04];
		b = pixels[yw24g + fx14];
		c = pixels[yw24g + fx24];
		d = pixels[yw24g + fx34];
		v2 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
		v2 = v2 > 255 ? 255 : v2 < 0 ? 0 : v2;

		a = pixels[yw34g + fx04];
		b = pixels[yw34g + fx14];
		c = pixels[yw34g + fx24];
		d = pixels[yw34g + fx34];
		v3 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
		v3 = v3 > 255 ? 255 : v3 < 0 ? 0 : v3;

		a = v0;
		b = v1;
		c = v2;
		d = v3;
		g = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentY) * percentY) * percentY + b;
		g = g > 255 ? 255 : g < 0 ? 0 : g ^ 0;

		// Blue
		a = pixels[yw04b + fx04];
		b = pixels[yw04b + fx14];
		c = pixels[yw04b + fx24];
		d = pixels[yw04b + fx34];
		v0 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
		v0 = v0 > 255 ? 255 : v0 < 0 ? 0 : v0;

		a = pixels[yw14b + fx04];
		b = pixels[yw14b + fx14];
		c = pixels[yw14b + fx24];
		d = pixels[yw14b + fx34];
		v1 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
		v1 = v1 > 255 ? 255 : v1 < 0 ? 0 : v1;

		a = pixels[yw24b + fx04];
		b = pixels[yw24b + fx14];
		c = pixels[yw24b + fx24];
		d = pixels[yw24b + fx34];
		v2 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
		v2 = v2 > 255 ? 255 : v2 < 0 ? 0 : v2;

		a = pixels[yw34b + fx04];
		b = pixels[yw34b + fx14];
		c = pixels[yw34b + fx24];
		d = pixels[yw34b + fx34];
		v3 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
		v3 = v3 > 255 ? 255 : v3 < 0 ? 0 : v3;

		a = v0;
		b = v1;
		c = v2;
		d = v3;
		b = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentY) * percentY) * percentY + b;
		b = b > 255 ? 255 : b < 0 ? 0 : b ^ 0;

		return [r, g, b];
    }

	
	return {
		nearest: nearest_unrolled,
		bilinear: bilinear_unrolled,
		bicubic: bicubic_unrolled
	};
	
});
