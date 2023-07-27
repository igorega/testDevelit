const amountInput = document.querySelector('#amount');
const fromSelect = document.querySelector('#fromCurrency');
const toSelect = document.querySelector('#toCurrency');
const outputElement = document.querySelector('#output');
const buttonConvert = document.querySelector('#buttonConvert');
const reg = /^[0-9]*\.?[0-9]*$/; // numbers & dot
let currencies;

const getCurrency = async () => {
	const accessKey = process.env.API_KEY;

	const url = 'https://api.exchangerate.host/latest';
	// const url = `http://api.exchangeratesapi.io/v1/latest?access_key=${accessKey}`;

	currencies = await fetch(url)
		.then(res => res.json())
		.then(data => data?.rates);

	Object.keys(currencies).forEach(currency => {
		const option = document.createElement('option');

		option.value = currency;
		option.innerText = currency;

		fromSelect.appendChild(option);
		toSelect.appendChild(option.cloneNode(true));
	});
};

getCurrency();

const convertCurrency = () => {
	const amount = parseInt(amountInput.value);
	const from = fromSelect.value;
	const to = toSelect.value;

	const eur = amount / currencies[from];
	const value = eur * currencies[to];

	outputElement.value = parseFloat(value.toFixed(2));
};

const historyItem = () => {
	const historyRow = document.createElement('tr');
	const historyColAmount = document.createElement('td');
	const historyColFrom = document.createElement('td');
	const historyColTo = document.createElement('td');
	const historyRemoveBtn = document.createElement('td');

	historyRow.classList.add('historyRow');

	historyColAmount.textContent = amountInput.value;
	historyColFrom.textContent = fromSelect.value;
	historyColTo.textContent = toSelect.value;
	historyRemoveBtn.innerHTML = '<button class="btn btn-danger removeRequest">Remove request</button>';

	document.querySelector('.historyTable').append(historyRow);

	const countRequests = 20;

	if (document.querySelectorAll('.historyRow').length > countRequests) {
		document.querySelectorAll('.historyRow')[0].remove();
	}

	historyRow.append(historyColAmount, historyColFrom, historyColTo, historyRemoveBtn);
};

const removeAllHistoryItem = () => {
	document.querySelector('#removeAllHistory').addEventListener('click', () => {
		document.querySelectorAll('.historyRow').forEach(item => {
			item.remove();
		});

		document.querySelector('.removeAllHistoryWrap').remove();
	});
};

const removeHistoryItem = () => {
	const removeRequestBtn = document.querySelectorAll('.removeRequest');

	removeRequestBtn.forEach(item => {
		item.addEventListener('click', () => {
			item.closest('.historyRow').remove();

			const removeAllRowBtn = document.querySelector('.removeAllHistoryWrap');
			const row = document.querySelectorAll('.historyRow');

			if (removeAllRowBtn && row.length === 0) {
				removeAllRowBtn.remove();
			}
		});
	});
};

const showRemoveBtn = () => {
	if (document.querySelectorAll('.historyRow').length === 1) {
		const historyRemoveAllBtn = document.createElement('div');

		historyRemoveAllBtn.classList.add('removeAllHistoryWrap', 'text-center');

		historyRemoveAllBtn.innerHTML = '<button id="removeAllHistory" class="btn btn-warning">Clear history</button>';
		document.querySelector('.historyBlock').append(historyRemoveAllBtn);

		removeAllHistoryItem();
	}
};

const amountInputValidation = () => {
	if (amountInput.value === '' || !reg.test(amountInput.value)) {
		buttonConvert.disabled = true;
	} else {
		buttonConvert.disabled = false;
	}
};

amountInputValidation();

amountInput.addEventListener('input', () => {
	amountInputValidation();
});

buttonConvert.addEventListener('click', () => {
	convertCurrency();
	historyItem();
	removeHistoryItem();
	showRemoveBtn();
});

amountInput.addEventListener('keydown', ({key}) => {
	if (key === 'Enter' && !buttonConvert.hasAttribute('disabled')) {
		convertCurrency();
		historyItem();
		removeHistoryItem();
		showRemoveBtn();
	}
});

amountInput.addEventListener('keyup', () => {
	if (!reg.test(amountInput.value)) {
		amountInput.value = '';
	}
});
