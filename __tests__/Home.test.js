import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../src/pages/index';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

jest.mock('../src/pages/api/omdb', () => ({
  searchMovies: jest.fn(),
  getMovieDetails: jest.fn(),
}));

const { searchMovies } = require('../src/pages/api/omdb');

describe('Home Component', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  it('searching', () => {
    render(<Home />);
    expect(screen.getByPlaceholderText('Bulmak istediğiniz filmin adını yazınız')).toBeInTheDocument();
  });

  it('get films', () => {
    render(<Home />);
    const searchInput = screen.getByPlaceholderText('Bulmak istediğiniz filmin adını yazınız');
    fireEvent.change(searchInput, { target: { value: 'The Silence of the Lambs' } });
    expect(searchInput.value).toBe('The Silence of the Lambs');
  });

  it('no results warnings', async () => {
    searchMovies.mockResolvedValueOnce({ movies: [] });
    render(<Home />);
    const searchInput = screen.getByPlaceholderText('Bulmak istediğiniz filmin adını yazınız');
    
    fireEvent.change(searchInput, { target: { value: 'NoFilm' } });

    await waitFor(() => {
      expect(screen.getByText('Sonuç bulunamadı')).toBeInTheDocument();
    });
  });
});

// Jest komut açıklamaları
// render -> component'i render eder
// screen -> component'teki elementlere erişim sağlar
// fireEvent -> component'te event tetikler
// waitFor -> async işlemleri bekler
// jest.mock -> modülü mock'lar
// jest.fn -> fonksiyonu mock'lar
// fetchMock.enableMocks -> fetch'i mock'lar
// fetchMock.resetMocks -> fetch'i sıfırlar
// mockResolvedValueOnce -> fonksiyonun bir kere çalışmasını sağlar
// getByPlaceholderText -> placeholder'ı olan elementi getirir
// getByText -> text'i olan elementi getirir
// expect -> bir değeri bekler
// toBe -> bir değeri bekler
// toBeInTheDocument -> bir değeri bekler
