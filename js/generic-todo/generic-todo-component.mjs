import { SORT_DIRECTION } from './generic-todo-store.mjs';
import { BaseComponent } from '../core/base-component.mjs';

export class GenericListComponent extends BaseComponent {
    listConfig = null;
    store = null;

    constructor(store) {
        super();
        this.store = store;
        this.store.refreshCb = this.refresh;
        this.listConfig = store.listConfig;
    }

    rendelList = () => {
        const headRow = this.renderHeadRow();
        const bodyRows = this.store.getItems().map(item => this.renderBodyRow(item));
        const listelement = { tagName: 'ul', attributes: this.listConfig.attributes, children: [headRow, ...bodyRows] };
        return { tagName: 'div', attributes: { className: 'list-container' }, children: [listelement] };
    }

    renderHeadRow = () => {
        const cell = this.listConfig.columns.map(column => {
            const ul = this.renderListHeadRow(column);
            return ul;
        });
        const actionCell = { tagName: 'div', children: ['Actions'] };
        return { tagName: 'li', children: [...cell, actionCell] };
    }

    renderBodyRow = (item) => {
        const cell = this.listConfig.columns.map(column => {
            const ul = this.rendelListCell(column.attributes, [column.getCellValue(item)]);
            return ul;
        });

       const deleteAction = { tagName: 'button', attributes: { className: 'delete-btn', onclick: () => this.store.delete(item) }, children: ['delete'] };

        const actions = [deleteAction];
        const actionCell = this.rendelListCell({}, actions);
        return { tagName: 'li', children: [...cell, actionCell] };
    }

    rendelListCell = (attributes, children) => {
        return { tagName: 'div', attributes, children };
    }

    renderListHeadRow = (column) => {
        const [ASC] = SORT_DIRECTION;
        const attributes = Object.assign({ className: 'sortable' }, column.attributes);
        const children = [
            { tagName: 'span', attributes: column.attributes, children: [column.label] }
        ];

        const [sortId, direction] = this.store.currentSort;
        if (column.sorter) {
            attributes.onclick = () => this.store.setSort(column.id);
            if (sortId === column.id) {
                const arrow = { tagName: 'span', attributes: { className: 'sort-arrow' }, children: [direction === ASC ? '↑': '↓'] };
                children.push(arrow);
            }
        }

        return { tagName: 'div', attributes, children };
    }

    renderForm = () => {
        const item = this.store.currentItem;
        const { formFields } = this.listConfig;

        const children = [
            { tagName: 'h2', children: [item.id ? 'Edit Form' : 'Add Form'] }
        ];

        formFields.forEach(fieldAttributes => {
            let value = item[fieldAttributes.name] || '';
            if (fieldAttributes.type === 'checkbox') {
                fieldAttributes.checked = item[fieldAttributes.name]
            } else if (fieldAttributes.type === 'datetime-local' && typeof value === 'string') {
                value = value.substr(0, 16);
            }
            children.push({ tagName: 'input', attributes: {...fieldAttributes, value: value } });
        });

        children.push(
            { 
                tagName: 'button', 
                attributes: { type: 'button', onclick: () => this.store.setCurrentItem(null) }, 
                children: ['Cancel'] 
            },
            { 
                tagName: 'input',  
                attributes: { value: 'Save', type: 'submit' } 
            }
        );

        const form = { 
            tagName: 'form', 
            attributes: { onsubmit: this.store.onSubmit }, 
            children 
        };

        return { tagName: 'div', attributes: { className: 'add-edit-form' }, children: [form] }; 
    }

    renderSearchBar = () => {
        return { 
            tagName: 'div', 
            attribtues: { className: 'search-container' }, 
            children: [
                { 
                    tagName: 'input', 
                    attributes: { placeholder: 'search', value: this.store.searchTerm, onkeyup: this.store.onSearch } 
                }
            ]
        };
    }

    renderAddButton = () => {
        return { 
            tagName: 'div', 
            attributes: { className: 'add-container' }, 
            children: [
                { 
                    tagName: 'button', 
                    attributes: { onclick: () => this.store.setCurrentItem() }, 
                    children: ['+'] 
                }
            ] 
        };
    }

    render() {
        const children = [
            this.renderSearchBar(),
            this.renderAddButton(),
            this.rendelList()
        ];

        if (this.store.currentItem) {
            children.push(this.renderForm());
        }
        return this.renderElement({ tagName: 'div', attributes: { className: 'generic-table' }, children });
    }
}
