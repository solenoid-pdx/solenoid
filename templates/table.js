const awg_table = `
<table class="table-bordered table-responsive" style="text-align:center;">
<tbody><tr>
<th rowspan="4">AWG
</th>
<th rowspan="3" colspan="2">Diameter
</th>
<th rowspan="3" colspan="2">Turns of wire, without insulation
</th>
<th rowspan="3" colspan="2">Area
</th>
<th colspan="8"><a href="/wiki/Copper" title="Copper">Copper</a> wire
</th></tr>
<tr>
<th rowspan="2" colspan="2"><a href="/wiki/Resistivity" class="mw-redirect" title="Resistivity">Resistance/length</a><sup id="cite_ref-resperlength_7-0" class="reference"><a href="#cite_note-resperlength-7">[7]</a></sup>
</th>
<th colspan="3"><a href="/wiki/Ampacity" title="Ampacity">Ampacity</a> of enclosed wire at 30&nbsp;°C ambient,<sup id="cite_ref-ampacity_8-0" class="reference"><a href="#cite_note-ampacity-8">[8]</a></sup> for given insulation material temperature rating,<br> or for single unbundled wires in equipment for 16 AWG and smaller<sup id="cite_ref-small_gauge_ampacity_9-0" class="reference"><a href="#cite_note-small_gauge_ampacity-9">[9]</a></sup>
</th>
<th colspan="3">Fusing current<sup id="cite_ref-SHEE_10-0" class="reference"><a href="#cite_note-SHEE-10">[10]</a></sup><sup id="cite_ref-Brooks_11-0" class="reference"><a href="#cite_note-Brooks-11">[11]</a></sup>
</th></tr>
<tr>
<th>60&nbsp;°C
</th>
<th>75&nbsp;°C
</th>
<th>90&nbsp;°C
</th>
<th>Preece<sup id="cite_ref-PREECE1_12-0" class="reference"><a href="#cite_note-PREECE1-12">[12]</a></sup><sup id="cite_ref-PREECE2_13-0" class="reference"><a href="#cite_note-PREECE2-13">[13]</a></sup><sup id="cite_ref-PREECE3_14-0" class="reference"><a href="#cite_note-PREECE3-14">[14]</a></sup><sup id="cite_ref-BROOKS1ADAM1_15-0" class="reference"><a href="#cite_note-BROOKS1ADAM1-15">[15]</a></sup>
</th>
<th colspan="2">Onderdonk<sup id="cite_ref-STAUFF_16-0" class="reference"><a href="#cite_note-STAUFF-16">[16]</a></sup><sup id="cite_ref-BROOKS1ADAM1_15-1" class="reference"><a href="#cite_note-BROOKS1ADAM1-15">[15]</a></sup>
</th></tr>
<tr>
<th>(in)
</th>
<th>(mm)
</th>
<th>(per&nbsp;in)
</th>
<th>(per&nbsp;cm)
</th>
<th>(<a href="/wiki/Circular_mil" title="Circular mil">kcmil</a>)
</th>
<th>(mm<sup>2</sup>)
</th>
<th>(mΩ/m<sup id="cite_ref-resm_17-0" class="reference"><a href="#cite_note-resm-17">[a]</a></sup>)
</th>
<th>(mΩ/ft<sup id="cite_ref-resft_18-0" class="reference"><a href="#cite_note-resft-18">[b]</a></sup>)
</th>
<th colspan="3">(A)
</th>
<th>~10 s
</th>
<th>1 s
</th>
<th>32&nbsp;ms
</th></tr>
<tr>
<td>0000 (4/0)</td>
<td>0.4600<sup id="cite_ref-def_19-0" class="reference"><a href="#cite_note-def-19">[c]</a></sup>
</td>
<td>11.684<sup id="cite_ref-def_19-1" class="reference"><a href="#cite_note-def-19">[c]</a></sup>
</td>
<td>2.17</td>
<td>0.856</td>
<td>212</td>
<td>107</td>
<td>0.1608</td>
<td>0.04901</td>
<td>195</td>
<td>230</td>
<td>260</td>
<td>3.2 kA</td>
<td>33 kA</td>
<td>182 kA
</td></tr>
<tr>
<td>000 (3/0)</td>
<td>0.4096</td>
<td>10.405</td>
<td>2.44</td>
<td>0.961</td>
<td>168</td>
<td>85.0</td>
<td>0.2028</td>
<td>0.06180</td>
<td>165</td>
<td>200</td>
<td>225</td>
<td>2.7 kA</td>
<td>26 kA</td>
<td>144 kA
</td></tr>
<tr>
<td>00 (2/0)</td>
<td>0.3648</td>
<td>9.266</td>
<td>2.74</td>
<td>1.08</td>
<td>133</td>
<td>67.4</td>
<td>0.2557</td>
<td>0.07793</td>
<td>145</td>
<td>175</td>
<td>195</td>
<td>2.3 kA</td>
<td>21 kA</td>
<td>115 kA
</td></tr>
<tr>
<td>0 (1/0)</td>
<td>0.3249</td>
<td>8.251</td>
<td>3.08</td>
<td>1.21</td>
<td>106</td>
<td>53.5</td>
<td>0.3224</td>
<td>0.09827</td>
<td>125</td>
<td>150</td>
<td>170</td>
<td>1.9 kA</td>
<td>16 kA</td>
<td>91 kA
</td></tr>
<tr>
<td>1</td>
<td>0.2893</td>
<td>7.348</td>
<td>3.46</td>
<td>1.36</td>
<td>83.7</td>
<td>42.4</td>
<td>0.4066</td>
<td>0.1239</td>
<td>110</td>
<td>130</td>
<td>145</td>
<td>1.6 kA</td>
<td>13 kA</td>
<td>72 kA
</td></tr>
<tr>
<td>2</td>
<td>0.2576</td>
<td>6.544</td>
<td>3.88</td>
<td>1.53</td>
<td>66.4</td>
<td>33.6</td>
<td>0.5127</td>
<td>0.1563</td>
<td>95</td>
<td>115</td>
<td>130</td>
<td>1.3 kA</td>
<td>10.2 kA</td>
<td>57 kA
</td></tr>
<tr>
<td>3</td>
<td>0.2294</td>
<td>5.827</td>
<td>4.36</td>
<td>1.72</td>
<td>52.6</td>
<td>26.7</td>
<td>0.6465</td>
<td>0.1970</td>
<td>85</td>
<td>100</td>
<td>115</td>
<td>1.1 kA</td>
<td>8.1 kA</td>
<td>45 kA
</td></tr>
<tr>
<td>4</td>
<td>0.2043</td>
<td>5.189</td>
<td>4.89</td>
<td>1.93</td>
<td>41.7</td>
<td>21.2</td>
<td>0.8152</td>
<td>0.2485</td>
<td>70</td>
<td>85</td>
<td>95</td>
<td>946 A</td>
<td>6.4 kA</td>
<td>36 kA
</td></tr>
<tr>
<td>5</td>
<td>0.1819</td>
<td>4.621</td>
<td>5.50</td>
<td>2.16</td>
<td>33.1</td>
<td>16.8</td>
<td>1.028</td>
<td>0.3133</td>
<td colspan="3"></td>
<td>795 A</td>
<td>5.1 kA</td>
<td>28 kA
</td></tr>
<tr>
<td>6</td>
<td>0.1620</td>
<td>4.115</td>
<td>6.17</td>
<td>2.43</td>
<td>26.3</td>
<td>13.3</td>
<td>1.296</td>
<td>0.3951</td>
<td>55</td>
<td>65</td>
<td>75</td>
<td>668 A</td>
<td>4.0 kA</td>
<td>23 kA
</td></tr>
<tr>
<td>7</td>
<td>0.1443</td>
<td>3.665</td>
<td>6.93</td>
<td>2.73</td>
<td>20.8</td>
<td>10.5</td>
<td>1.634</td>
<td>0.4982</td>
<td colspan="3"></td>
<td>561 A</td>
<td>3.2 kA</td>
<td>18 kA
</td></tr>
<tr>
<td>8</td>
<td>0.1285</td>
<td>3.264</td>
<td>7.78</td>
<td>3.06</td>
<td>16.5</td>
<td>8.37</td>
<td>2.061</td>
<td>0.6282</td>
<td>40</td>
<td>50</td>
<td>55</td>
<td>472 A</td>
<td>2.5 kA</td>
<td>14 kA
</td></tr>
<tr>
<td>9</td>
<td>0.1144</td>
<td>2.906</td>
<td>8.74</td>
<td>3.44</td>
<td>13.1</td>
<td>6.63</td>
<td>2.599</td>
<td>0.7921</td>
<td colspan="3"></td>
<td>396 A</td>
<td>2.0 kA</td>
<td>11 kA
</td></tr>
<tr>
<td>10</td>
<td>0.1019</td>
<td>2.588</td>
<td>9.81</td>
<td>3.86</td>
<td>10.4</td>
<td>5.26</td>
<td>3.277</td>
<td>0.9989</td>
<td>30</td>
<td>35</td>
<td>40</td>
<td>333 A</td>
<td>1.6 kA</td>
<td>8.9 kA
</td></tr>
<tr>
<td>11</td>
<td>0.0907</td>
<td>2.305</td>
<td>11.0</td>
<td>4.34</td>
<td>8.23</td>
<td>4.17</td>
<td>4.132</td>
<td>1.260</td>
<td colspan="3"></td>
<td>280 A</td>
<td>1.3 kA</td>
<td>7.1 kA
</td></tr>
<tr>
<td>12</td>
<td>0.0808</td>
<td>2.053</td>
<td>12.4</td>
<td>4.87</td>
<td>6.53</td>
<td>3.31</td>
<td>5.211</td>
<td>1.588</td>
<td>20</td>
<td>25</td>
<td>30</td>
<td>235 A</td>
<td>1.0 kA</td>
<td>5.6 kA
</td></tr>
<tr>
<td>13</td>
<td>0.0720</td>
<td>1.828</td>
<td>13.9</td>
<td>5.47</td>
<td>5.18</td>
<td>2.62</td>
<td>6.571</td>
<td>2.003</td>
<td colspan="3"></td>
<td>198 A</td>
<td>798 A</td>
<td>4.5 kA
</td></tr>
<tr>
<td>14</td>
<td>0.0641</td>
<td>1.628</td>
<td>15.6</td>
<td>6.14</td>
<td>4.11</td>
<td>2.08</td>
<td>8.286</td>
<td>2.525</td>
<td>15</td>
<td>20</td>
<td>25</td>
<td>166 A</td>
<td>633 A</td>
<td>3.5 kA
</td></tr>
<tr>
<td>15</td>
<td>0.0571</td>
<td>1.450</td>
<td>17.5</td>
<td>6.90</td>
<td>3.26</td>
<td>1.65</td>
<td>10.45</td>
<td>3.184</td>
<td colspan="3"></td>
<td>140 A</td>
<td>502 A</td>
<td>2.8 kA
</td></tr>
<tr>
<td>16</td>
<td>0.0508</td>
<td>1.291</td>
<td>19.7</td>
<td>7.75</td>
<td>2.58</td>
<td>1.31</td>
<td>13.17</td>
<td>4.016</td>
<td></td>
<td></td>
<td>18</td>
<td>117 A</td>
<td>398 A</td>
<td>2.2 kA
</td></tr>
<tr>
<td>17</td>
<td>0.0453</td>
<td>1.150</td>
<td>22.1</td>
<td>8.70</td>
<td>2.05</td>
<td>1.04</td>
<td>16.61</td>
<td>5.064</td>
<td colspan="3"></td>
<td>99 A</td>
<td>316 A</td>
<td>1.8 kA
</td></tr>
<tr>
<td>18</td>
<td>0.0403</td>
<td>1.024</td>
<td>24.8</td>
<td>9.77</td>
<td>1.62</td>
<td>0.823</td>
<td>20.95</td>
<td>6.385</td>
<td>10</td>
<td>14</td>
<td>16</td>
<td>83 A</td>
<td>250 A</td>
<td>1.4 kA
</td></tr>
<tr>
<td>19</td>
<td>0.0359</td>
<td>0.912</td>
<td>27.9</td>
<td>11.0</td>
<td>1.29</td>
<td>0.653</td>
<td>26.42</td>
<td>8.051</td>
<td>—</td>
<td>—</td>
<td>—</td>
<td>70 A</td>
<td>198 A</td>
<td>1.1 kA
</td></tr>
<tr>
<td>20</td>
<td>0.0320</td>
<td>0.812</td>
<td>31.3</td>
<td>12.3</td>
<td>1.02</td>
<td>0.518</td>
<td>33.31</td>
<td>10.15</td>
<td>5</td>
<td>11</td>
<td>—</td>
<td>58.5 A</td>
<td>158 A</td>
<td>882 A
</td></tr>
<tr>
<td>21</td>
<td>0.0285</td>
<td>0.723</td>
<td>35.1</td>
<td>13.8</td>
<td>0.810</td>
<td>0.410</td>
<td>42.00</td>
<td>12.80</td>
<td>—</td>
<td>—</td>
<td>—</td>
<td>49 A</td>
<td>125 A</td>
<td>700 A
</td></tr>
<tr>
<td>22</td>
<td>0.0253</td>
<td>0.644</td>
<td>39.5</td>
<td>15.5</td>
<td>0.642</td>
<td>0.326</td>
<td>52.96</td>
<td>16.14</td>
<td>3</td>
<td>7</td>
<td>—</td>
<td>41 A</td>
<td>99 A</td>
<td>551 A
</td></tr>
<tr>
<td>23</td>
<td>0.0226</td>
<td>0.573</td>
<td>44.3</td>
<td>17.4</td>
<td>0.509</td>
<td>0.258</td>
<td>66.79</td>
<td>20.36</td>
<td>—</td>
<td>—</td>
<td>—</td>
<td>35 A</td>
<td>79 A</td>
<td>440 A
</td></tr>
<tr>
<td>24</td>
<td>0.0201</td>
<td>0.511</td>
<td>49.7</td>
<td>19.6</td>
<td>0.404</td>
<td>0.205</td>
<td>84.22</td>
<td>25.67</td>
<td>2.1</td>
<td>3.5</td>
<td>—</td>
<td>29 A</td>
<td>62 A</td>
<td>348 A
</td></tr>
<tr>
<td>25</td>
<td>0.0179</td>
<td>0.455</td>
<td>55.9</td>
<td>22.0</td>
<td>0.320</td>
<td>0.162</td>
<td>106.2</td>
<td>32.37</td>
<td>—</td>
<td>—</td>
<td>—</td>
<td>24 A</td>
<td>49 A</td>
<td>276 A
</td></tr>
<tr>
<td>26</td>
<td>0.0159</td>
<td>0.405</td>
<td>62.7</td>
<td>24.7</td>
<td>0.254</td>
<td>0.129</td>
<td>133.9</td>
<td>40.81</td>
<td>1.3</td>
<td>2.2</td>
<td>—</td>
<td>20 A</td>
<td>39 A</td>
<td>218 A
</td></tr>
<tr>
<td>27</td>
<td>0.0142</td>
<td>0.361</td>
<td>70.4</td>
<td>27.7</td>
<td>0.202</td>
<td>0.102</td>
<td>168.9</td>
<td>51.47</td>
<td>—</td>
<td>—</td>
<td>—</td>
<td>17 A</td>
<td>31 A</td>
<td>174 A
</td></tr>
<tr>
<td>28</td>
<td>0.0126</td>
<td>0.321</td>
<td>79.1</td>
<td>31.1</td>
<td>0.160</td>
<td>0.0810</td>
<td>212.9</td>
<td>64.90</td>
<td>0.83</td>
<td>1.4</td>
<td>—</td>
<td>14 A</td>
<td>24 A</td>
<td>137 A
</td></tr>
<tr>
<td>29</td>
<td>0.0113</td>
<td>0.286</td>
<td>88.8</td>
<td>35.0</td>
<td>0.127</td>
<td>0.0642</td>
<td>268.5</td>
<td>81.84</td>
<td>—</td>
<td>—</td>
<td>—</td>
<td>12 A</td>
<td>20 A</td>
<td>110 A
</td></tr>
<tr>
<td>30</td>
<td>0.0100</td>
<td>0.255</td>
<td>99.7</td>
<td>39.3</td>
<td>0.101</td>
<td>0.0509</td>
<td>338.6</td>
<td>103.2</td>
<td>0.52</td>
<td>0.86</td>
<td>—</td>
<td>10 A</td>
<td>15 A</td>
<td>86 A
</td></tr>
<tr>
<td>31</td>
<td>0.00893</td>
<td>0.227</td>
<td>112</td>
<td>44.1</td>
<td>0.0797</td>
<td>0.0404</td>
<td>426.9</td>
<td>130.1</td>
<td>—</td>
<td>—</td>
<td>—</td>
<td>9 A</td>
<td>12 A</td>
<td>69 A
</td></tr>
<tr>
<td>32</td>
<td>0.00795</td>
<td>0.202</td>
<td>126</td>
<td>49.5</td>
<td>0.0632</td>
<td>0.0320</td>
<td>538.3</td>
<td>164.1</td>
<td>0.32</td>
<td>0.53</td>
<td>—</td>
<td>7 A</td>
<td>10 A</td>
<td>54 A
</td></tr>
<tr>
<td>33</td>
<td>0.00708</td>
<td>0.180</td>
<td>141</td>
<td>55.6</td>
<td>0.0501</td>
<td>0.0254</td>
<td>678.8</td>
<td>206.9</td>
<td>—</td>
<td>—</td>
<td>—</td>
<td>6 A</td>
<td>7.7 A</td>
<td>43 A
</td></tr>
<tr>
<td>34</td>
<td>0.00630</td>
<td>0.160</td>
<td>159</td>
<td>62.4</td>
<td>0.0398</td>
<td>0.0201</td>
<td>856.0</td>
<td>260.9</td>
<td>0.18</td>
<td>0.3</td>
<td>—</td>
<td>5 A</td>
<td>6.1 A</td>
<td>34 A
</td></tr>
<tr>
<td>35</td>
<td>0.00561</td>
<td>0.143</td>
<td>178</td>
<td>70.1</td>
<td>0.0315</td>
<td>0.0160</td>
<td>1079</td>
<td>329.0</td>
<td>—</td>
<td>—</td>
<td>—</td>
<td>4 A</td>
<td>4.8 A</td>
<td>27 A
</td></tr>
<tr>
<td>36</td>
<td>0.00500<sup id="cite_ref-def_19-2" class="reference"><a href="#cite_note-def-19">[c]</a></sup>
</td>
<td>0.127<sup id="cite_ref-def_19-3" class="reference"><a href="#cite_note-def-19">[c]</a></sup>
</td>
<td>200</td>
<td>78.7</td>
<td>0.0250</td>
<td>0.0127</td>
<td>1361</td>
<td>414.8</td>
<td>—</td>
<td>—</td>
<td>—</td>
<td>4 A</td>
<td>3.9 A</td>
<td>22 A
</td></tr>
<tr>
<td>37</td>
<td>0.00445</td>
<td>0.113</td>
<td>225</td>
<td>88.4</td>
<td>0.0198</td>
<td>0.0100</td>
<td>1716</td>
<td>523.1</td>
<td>—</td>
<td>—</td>
<td>—</td>
<td>3 A</td>
<td>3.1 A</td>
<td>17 A
</td></tr>
<tr>
<td>38</td>
<td>0.00397</td>
<td>0.101</td>
<td>252</td>
<td>99.3</td>
<td>0.0157</td>
<td>0.00797</td>
<td>2164</td>
<td>659.6</td>
<td>—</td>
<td>—</td>
<td>—</td>
<td>3 A</td>
<td>2.4 A</td>
<td>14 A
</td></tr>
<tr>
<td>39</td>
<td>0.00353</td>
<td>0.0897</td>
<td>283</td>
<td>111</td>
<td>0.0125</td>
<td>0.00632</td>
<td>2729</td>
<td>831.8</td>
<td>—</td>
<td>—</td>
<td>—</td>
<td>2 A</td>
<td>1.9 A</td>
<td>11 A
</td></tr>
<tr>
<td>40</td>
<td>0.00314</td>
<td>0.0799</td>
<td>318</td>
<td>125</td>
<td>0.00989</td>
<td>0.00501</td>
<td>3441</td>
<td>1049</td>
<td>—</td>
<td>—</td>
<td>—</td>
<td>1 A</td>
<td>1.5 A</td>
<td>8.5 A
</td></tr></tbody></table>
`;

document
    .getElementById('awg-table-container')
    .insertAdjacentHTML('beforeend',awg_table);