import { mount } from "@vue/test-utils";
import App from "../../src/App.vue";
const wrapper = mount(App);

describe("App", () => {
    it("renders the correct markup", () => {
        expect(wrapper.html()).toContain('<div id="app">');
    });

    it("contains a table", () => {
        expect(wrapper.contains("table")).toBe(true);
    });

    describe("filters", () => {
        describe("Already published", () => {
            it("checking box should apply filter", () => {
                expect(wrapper.vm.publishedFilter).toBe(false);
                const publishedCheckbox = wrapper.find("#published");
                publishedCheckbox.setChecked();
                expect(wrapper.vm.publishedFilter).toBe(true);
            });
            it("table column 'Published' should not include any rows with future date", () => {
                const publishedCheckbox = wrapper.find("#published");
                const publishedCells = wrapper.findAll(".published-at");
                publishedCheckbox.setChecked();
                publishedCells.wrappers.forEach(wrapper => {
                    const date = wrapper.text();
                    expect(Date.parse(date)).not.toBeGreaterThan(
                        Date.parse(new Date())
                    );
                });
            });
        });
    });

    describe("events", () => {});
});
