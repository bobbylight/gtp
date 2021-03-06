import { Pool } from '../index';

describe('Pool', () => {

	/**
	 * A simple dummy class used in these tests.
	 */
	class Widget {

		type: any;
		price: number;

		constructor() {
			this.type = null;
			this.price = 0;
		}
	}

	it('constructor, 0-arg', () => {
		const pool: Pool<Widget> = new Pool<Widget>(Widget);
		expect(pool.borrowedCount).toBe(0);
		expect(pool.length).toBe(20);
	});

	it('constructor, 1-arg', () => {
		const pool: Pool<Widget> = new Pool<Widget>(Widget, 50);
		expect(pool.borrowedCount).toBe(0);
		expect(pool.length).toBe(50);
	});

	it('borrowObj() happy path', () => {

		const pool: Pool<Widget> = new Pool<Widget>(Widget);
		expect(pool.borrowedCount).toBe(0);

		const widget: Widget = pool.borrowObj();
		expect(pool.borrowedCount).toBe(1);
		expect(widget.type).toBeNull();
		expect(widget.price).toBe(0);

		pool.returnObj(widget);
		expect(pool.borrowedCount).toBe(0);
	});

	it('borrowObj() until pool grown', () => {

		const growCount: number = 7;
		const pool: Pool<Widget> = new Pool<Widget>(Widget, 3, growCount);
		expect(pool.borrowedCount).toBe(0);

		pool.borrowObj();
		pool.borrowObj();
		pool.borrowObj();
		expect(pool.borrowedCount).toBe(3);
		expect(pool.length).toBe(3 + growCount);
	});

	it('returnObj() happy path', () => {

		const pool: Pool<Widget> = new Pool<Widget>(Widget);
		expect(pool.borrowedCount).toBe(0);

		const widget: Widget = pool.borrowObj();
		expect(pool.borrowedCount).toBe(1);
		expect(widget.type).toBeNull();
		expect(widget.price).toBe(0);

		const result: any = pool.returnObj(widget);
		expect(result).toBeTruthy();
		expect(pool.borrowedCount).toBe(0);
	});

	it('returnObj() invalid object', () => {

		const pool: Pool<Widget> = new Pool<Widget>(Widget);
		expect(pool.borrowedCount).toBe(0);

		const invalidWidget: Widget = new Widget();
		const result: any = pool.returnObj(invalidWidget);
		expect(result).toBeFalsy();
		expect(pool.borrowedCount).toBe(0);
	});

	it('reset() happy path', () => {

		const pool: Pool<Widget> = new Pool<Widget>(Widget);
		expect(pool.borrowedCount).toBe(0);

		pool.borrowObj();
		pool.borrowObj();
		pool.borrowObj();
		expect(pool.borrowedCount).toBe(3);

		pool.reset();
		expect(pool.borrowedCount).toBe(0);
	});

	it('toString()', () => {
		const pool: Pool<Widget> = new Pool<Widget>(Widget);
		const actual: string = pool.toString();
		expect(actual).toBe('[Pool: borrowed=0, size=20]');
	});
});
