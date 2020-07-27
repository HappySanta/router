import {Route} from "./Route";
import {State} from "./State";


export class History {

	private stack: [Route,State][] = [];
	private currentIndex: number = -1;

	init(r: Route, s:State) {
		this.stack = [[r,s]];
		this.currentIndex = 0;
	}

	push(r: Route, s:State):[Route,Route?] {
		const current = this.getCurrentRoute();
		if (this.getCurrentIndex() !== this.getLength() - 1) {
			//Пуш после отката назад, в этом случае вся история "впереди удаляется"
			this.stack = this.stack.slice(0, this.getCurrentIndex()+1);
		}
		this.stack.push([r,s]);
		this.currentIndex = this.stack.length - 1;
		const next = this.getCurrentRoute();
		current?.out();
		next?.in();
		if (next) {
			return [next, current]
		} else {
			// Если мы только что запушили новое состояние то оно никак не может оказаться пустым
			// если оказалос то что-то не так
			throw new Error("Impossible error on push state, next state is empty!")
		}
	}

	replace(r: Route, s:State):[Route,Route?] {
		const current = this.getCurrentRoute();
		this.stack[this.currentIndex] = [r,s];
		const next = this.getCurrentRoute();
		current?.out();
		next?.in();
		if (next) {
			return [next, current]
		} else {
			// Если мы только что заменили состояние то оно никак не может оказаться пустым
			// если оказалос то что-то не так
			throw new Error("Impossible error on replace state, next state is empty!")
		}
	}

	setCurrentIndex(x: number):[Route,Route?] {
		const current = this.getCurrentRoute();
		this.currentIndex = x;
		const next = this.getCurrentRoute();
		current?.out();
		next?.in();
		if (next) {
			return [next,current]
		} else {
			// Если мы только что заменили состояние то оно никак не может оказаться пустым
			// если оказалос то что-то не так
			throw new Error("Impossible error on push state, next state is empty!")
		}
	}

	move(to: number) {
		this.currentIndex += to
	}

	getLength() {
		return this.stack.length
	}

	getCurrentIndex(): number {
		return this.currentIndex
	}

	getCurrentRoute():Route|undefined {
		return this.stack[this.currentIndex] ? this.stack[this.currentIndex][0] : undefined
	}

	getCurrentState():State|undefined {
		return this.stack[this.currentIndex] ? this.stack[this.currentIndex][1] : undefined
	}

	canJumpIntoOffset(offset:number) {
		const index = this.currentIndex + offset;
		return index >= 0 && index <= this.getLength()-1
	}

	getPageOffset(pageId: string): number {
		for (let i = this.currentIndex - 1; i >= 0; i--) {
			const route = this.stack[i][0];
			if (route.getPageId() === pageId) {
				//Страница совпадает но может быть ситуация когда поврех этой страницы попап или модалка
				//такое мы дожны пропустить нас попросили найти смещение до конкретной страницы
				if (!route.hasOverlay()) {
					return i - this.currentIndex
				}
			}
		}
		return 0
	}

	getFirstPageOffset(): number {
		for (let i = this.currentIndex - 1; i >= 0; i--) {
			const route = this.stack[i][0];
			if (!route.hasOverlay()) {
				return i - this.currentIndex
			}
		}
		return 0
	}

	getHistoryFromStartToCurrent(): [Route,State][] {
		return this.stack.slice(0, this.currentIndex)
	}

}


