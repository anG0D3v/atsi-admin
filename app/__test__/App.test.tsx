import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { vi, it, expect, describe } from 'vitest';
import Home from '../page';
import 'jsdom-global/register';

Enzyme.configure({ adapter: new Adapter() });
describe('Sample Testing', () => {
  it('Should find h1 with title', () => {
    const wrapper = mount(<Home />);

    const title = wrapper.find('h1');
    expect(title.text()).eql('Home Page');
  });
});
