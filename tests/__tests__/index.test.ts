import axios from 'axios';

it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
});

it('Test localhost', async (done) => {
    const resp = await axios.get('http://localhost:49160');

    expect(resp.data).toBe('Hello World');

    done();
});
